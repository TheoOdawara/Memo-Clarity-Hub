// Simple content moderation for testimonies
const MEDICAL_CLAIMS = [
  'cura', 'curar', 'curei', 'doença', 'doente', 'medicina', 'médico', 'tratamento',
  'diagnóstico', 'sintoma', 'remédio', 'medicamento', 'terapia', 'depressão',
  'ansiedade', 'transtorno', 'distúrbio', 'heal', 'cure', 'disease', 'illness',
  'medical', 'doctor', 'treatment', 'diagnosis', 'symptom', 'medication', 'therapy'
];

const INAPPROPRIATE_WORDS = [
  'spam', 'venda', 'compre', 'dinheiro', 'grátis', 'promoção', 'desconto',
  'link', 'site', 'www', 'http', '.com', '@', 'whatsapp', 'telegram'
];

export const moderateContent = (content: string): { approved: boolean; reason?: string } => {
  const lowerContent = content.toLowerCase();
  
  // Check length
  if (content.length > 280) {
    return { approved: false, reason: "Depoimento muito longo. Máximo 280 caracteres." };
  }
  
  if (content.length < 10) {
    return { approved: false, reason: "Depoimento muito curto. Mínimo 10 caracteres." };
  }
  
  // Check for medical claims
  const hasMedicalClaims = MEDICAL_CLAIMS.some(word => 
    lowerContent.includes(word)
  );
  
  if (hasMedicalClaims) {
    return { 
      approved: false, 
      reason: "Não é permitido fazer alegações médicas nos depoimentos." 
    };
  }
  
  // Check for inappropriate content
  const hasInappropriateContent = INAPPROPRIATE_WORDS.some(word => 
    lowerContent.includes(word)
  );
  
  if (hasInappropriateContent) {
    return { 
      approved: false, 
      reason: "Conteúdo não permitido detectado." 
    };
  }
  
  return { approved: true };
};