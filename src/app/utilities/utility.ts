export function calculateAge(dob: string | undefined): string {
  if (!dob) {
    return '';
  }
  const today = new Date();
  const birthDate = new Date(dob);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const daysInPreviousMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += daysInPreviousMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  let ageString = '';

  if (years > 0) {
    ageString += `${years} year${years > 1 ? 's' : ''}`;
  }

  if (months > 0) {
    ageString += ageString
      ? `, ${months} month${months > 1 ? 's' : ''}`
      : `${months} month${months > 1 ? 's' : ''}`;
  }

  if (days > 0) {
    ageString += ageString
      ? `, ${days} day${days > 1 ? 's' : ''}`
      : `${days} day${days > 1 ? 's' : ''}`;
  }
  return (ageString || '0 days') + ' old';
}
