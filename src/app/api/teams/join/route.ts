import { createServer } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/teams/join?code=TT-XXXXXX  — look up team by invite code
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'code is required' }, { status: 400 });
  }

  const { data: team, error } = await supabaseAdmin
    .from('teams')
    .select(
      `team_id, team_name, team_status, event_id, team_lead_id, team_lead_email,
       events(name, min_team_size, max_team_size)`
    )
    .eq('invite_code', code.toUpperCase())
    .single();

  if (error || !team) {
    return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
  }

  if (team.team_status === 'closed') {
    return NextResponse.json(
      { error: 'This team is already full' },
      { status: 409 }
    );
  }

  // Fetch participants and team lead in parallel
  const [participantsRes, leadRes] = await Promise.all([
    supabaseAdmin
      .from('participants')
      .select('name, email, phone, college')
      .eq('team_id', team.team_id),
    supabaseAdmin
      .from('users')
      .select('name, phone')
      .eq('id', team.team_lead_id)
      .maybeSingle(),
  ]);

  const participants = participantsRes.data ?? [];
  const totalMembers = participants.length + 1; // +1 for team lead
  const event = team.events as any;

  const members = [
    {
      label: 'Team Lead',
      name: leadRes.data?.name ?? team.team_lead_email ?? '—',
      email: team.team_lead_email,
      phone: leadRes.data?.phone ?? null,
    },
    ...participants.map((p: any, i: number) => ({
      label: `Member ${i + 2}`,
      name: p.name,
      email: p.email,
      phone: p.phone ?? null,
    })),
  ];

  return NextResponse.json({
    team_id: team.team_id,
    team_name: team.team_name,
    team_status: team.team_status,
    event_id: team.event_id,
    event_name: event?.name,
    current_members: totalMembers,
    min_team_size: event?.min_team_size,
    max_team_size: event?.max_team_size,
    slots_available: (event?.max_team_size ?? 0) - totalMembers,
    members,
  });
}

// POST /api/teams/join  — join a team via invite code
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { invite_code, name, phone, email, college, extras } = body;

    if (!invite_code || !name || !phone || !email || !college) {
      return NextResponse.json(
        { error: 'invite_code, name, phone, email, college are required' },
        { status: 400 }
      );
    }

    // Fetch the team
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select(
        `team_id, team_name, team_status, event_id,
         events(name, min_team_size, max_team_size)`
      )
      .eq('invite_code', invite_code.toUpperCase())
      .single();

    if (teamError || !team) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      );
    }

    if (team.team_status === 'closed') {
      return NextResponse.json(
        { error: 'This team is already full' },
        { status: 409 }
      );
    }

    const event = team.events as any;

    // Check if this email is already in the team
    const { data: existing } = await supabaseAdmin
      .from('participants')
      .select('email')
      .eq('team_id', team.team_id)
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'This email is already in the team' },
        { status: 409 }
      );
    }

    // Check team lead email
    const { data: teamData } = await supabaseAdmin
      .from('teams')
      .select('team_lead_email')
      .eq('team_id', team.team_id)
      .single();

    if (teamData?.team_lead_email === email) {
      return NextResponse.json(
        { error: 'This email is already the team lead' },
        { status: 409 }
      );
    }

    // Count current participants
    const { count: participantCount } = await supabaseAdmin
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', team.team_id);

    const totalMembers = (participantCount ?? 0) + 1; // +1 for team lead
    const maxTeamSize = event?.max_team_size ?? 4;
    const minTeamSize = event?.min_team_size ?? 2;

    if (totalMembers >= maxTeamSize) {
      // Mark closed and reject
      await supabaseAdmin
        .from('teams')
        .update({ team_status: 'closed' })
        .eq('team_id', team.team_id);

      return NextResponse.json(
        { error: 'Team is already full' },
        { status: 409 }
      );
    }

    // Add participant
    const { error: insertError } = await supabaseAdmin
      .from('participants')
      .insert({
        team_id: team.team_id,
        name,
        phone,
        email,
        college,
        extras: extras ?? {},
      });

    if (insertError) {
      console.error('Insert participant error:', insertError);
      return NextResponse.json(
        { error: 'Failed to join team' },
        { status: 500 }
      );
    }

    // Update team_status based on new count
    const newTotal = totalMembers + 1;
    let newStatus: string = team.team_status;
    if (newTotal >= maxTeamSize) {
      newStatus = 'closed';
    } else if (newTotal >= minTeamSize && team.team_status === 'pending') {
      newStatus = 'active';
    }

    if (newStatus !== team.team_status) {
      await supabaseAdmin
        .from('teams')
        .update({ team_status: newStatus })
        .eq('team_id', team.team_id);

      // If team closed, withdraw discovery listing
      if (newStatus === 'closed') {
        await supabaseAdmin
          .from('team_discovery')
          .update({ status: 'matched' })
          .eq('team_id', team.team_id);
      }
    }

    // If joiner had a waitlist entry, mark as matched
    const { data: joinerUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (joinerUser) {
      await supabaseAdmin
        .from('team_discovery')
        .update({ status: 'matched' })
        .eq('event_id', team.event_id)
        .eq('user_id', joinerUser.id);
    }

    return NextResponse.json({
      success: true,
      team_name: team.team_name,
      event_name: event?.name,
    });
  } catch (err) {
    console.error('Join team error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
