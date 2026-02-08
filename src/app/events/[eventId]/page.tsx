// use conditional rendering here based on supabase UUID or event id
import EventDetails from '@/components/eventDetails/EventDetails';
import React from 'react';

const page = () => {
  return (
    <EventDetails
      event={{
        title: 'CODE AND SEEK',
        description:
          'Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Donec molestie eleifend commodo.',
        rules:
          'Rule 1: All participants must register before the deadline.\nRule 2: Teams can have a maximum of 4 members.\nRule 3: The decision of the judges will be final.\nRule 4: No plagiarism or unfair means allowed.\nRule 5: Participants must carry valid college ID.',
        moreDetails:
          'This is an exciting coding event where participants will solve challenging problems. The event will test your problem-solving skills, coding abilities, and teamwork. Winners will receive exciting prizes and certificates.',
        lastDate: '16TH FEBRUARY 2026',
        venue: '21 FEB, RCCIIT',
        fee: '100/-',
        characterImage: '/eventDetails/codeAndSeek/loki.png',
        backgroundImage: '/eventDetails/codeAndSeek/lokiBg.png',
      }}
    />
  );
};

export default page;
