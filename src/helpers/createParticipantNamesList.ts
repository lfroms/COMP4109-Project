export default function createParticipantNamesList(
  participants: API.User[],
  currentUserId?: number
) {
  if (!participants.length) {
    return '';
  }

  const filteredParticipants = participants.filter(participant => participant.id !== currentUserId);

  if (!filteredParticipants.length) {
    return participants[0].name;
  }

  const names = filteredParticipants.map(participant => {
    const parts = participant.name.split(' ');

    if (parts.length !== 2) {
      return participant.name;
    }

    return parts[0];
  });

  if (filteredParticipants.length > 2) {
    return names.join(', ');
  }

  if (filteredParticipants.length === 2) {
    return names.join(' & ');
  }

  return filteredParticipants[0].name;
}
