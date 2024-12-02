// gestos.js

// Função para detectar "Eu te amo"
export function detectEuTeAmo(landmarks) {
    const thumbUp = landmarks[4].y < landmarks[3].y;
    const indexUp = landmarks[8].y < landmarks[6].y;
    const pinkyUp = landmarks[20].y < landmarks[18].y;
    const middleDown = landmarks[12].y > landmarks[10].y;
    const ringDown = landmarks[16].y > landmarks[14].y;
    return thumbUp && indexUp && pinkyUp && middleDown && ringDown;
  }
  
  // Função para detectar "Oi"
  export function detectOi(landmarks) {
    // Verificar se o polegar e o indicador estão próximos (formando a letra "O")
    const thumbAndIndexClose = Math.abs(landmarks[4].y - landmarks[8].y) < 0.05; // Verifica se os dedos estão próximos
  
    // Verificar se o mindinho está esticado para cima
    const pinkyUp = landmarks[20].y < landmarks[18].y && landmarks[20].y < landmarks[16].y;
  
    // Verificar se os outros dedos (médio e anelar) estão dobrados
    const middleDown = landmarks[12].y > landmarks[10].y;
    const ringDown = landmarks[16].y > landmarks[14].y;
  
    // O gesto "oi" acontece quando o polegar e o indicador estão próximos, o mindinho está para cima, e os outros dedos estão dobrados
    return thumbAndIndexClose && pinkyUp && middleDown && ringDown;
  }
  
  
  // Função para detectar "Obrigado"
  export function detectThankYou(landmarks, lastLandmarks) {
    const palmOpen =
      landmarks[4].x > landmarks[3].x &&
      landmarks[8].y < landmarks[6].y &&
      landmarks[12].y < landmarks[10].y &&
      landmarks[16].y < landmarks[14].y &&
      landmarks[20].y < landmarks[18].y;
  
    const nearMouth = landmarks[4].y > landmarks[0].y && landmarks[4].y < landmarks[9].y;
  
    let forwardMovement = false;
    if (lastLandmarks) {
      const deltaZ = lastLandmarks[0].z - landmarks[0].z;
      forwardMovement = deltaZ > 0.1;
    }
  
    return palmOpen && nearMouth && forwardMovement;
  }
  