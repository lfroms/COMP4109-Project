export default function createParticipantNamesList(participants: API.User[]) {
  const names = participants.map(participant => {
    const parts = participant.name.split(' ');

    if (parts.length !== 2) {
      return participant.name;
    }

    return parts[0];
  });

  if (names.length > 2) {
    return names.join(', ');
  }

  if (names.length === 2) {
    return names.join(' & ');
  }

  return participants[0].name;
}
