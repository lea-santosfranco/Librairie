export const formatMemberSince = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const years = now.getFullYear() - date.getFullYear();
  const months = now.getMonth() - date.getMonth() + years * 12;
  if (months < 1) return "Membre depuis moins d'un mois";
  if (months < 12) return `Membre depuis ${months} mois`;
  return `Membre depuis ${years} an${years > 1 ? 's' : ''}`;
};

export const formatPublishDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
