// gestos.js

// Função para detectar "Eu te amo"
export function gestoEuTeAmo(landmarks) {
    const thumbUp = landmarks[4].y < landmarks[3].y;
    const indexUp = landmarks[8].y < landmarks[6].y;
    const pinkyUp = landmarks[20].y < landmarks[18].y;
    const middleDown = landmarks[12].y > landmarks[10].y;
    const ringDown = landmarks[16].y > landmarks[14].y;
    return thumbUp && indexUp && pinkyUp && middleDown && ringDown;
}
  
// Função para detectar "Oi"
export function gestoOi(landmarks) {
    const thumbAndIndexClose = Math.abs(landmarks[4].y - landmarks[8].y) < 0.05;
    const pinkyUp = landmarks[20].y < landmarks[18].y && landmarks[20].y < landmarks[16].y;
    const middleDown = landmarks[12].y > landmarks[10].y;
    const ringDown = landmarks[16].y > landmarks[14].y;
    return thumbAndIndexClose && pinkyUp && middleDown && ringDown;
}
  
export function gestoObrigado(landmarks, lastLandmarks) {
    // Verificando se a palma da mão está aberta
    const palmOpen =
        landmarks[4].x > landmarks[3].x && // polegar à direita da base do polegar
        landmarks[8].y < landmarks[6].y && // indicador curvado para baixo
        landmarks[12].y < landmarks[10].y && // médio curvado para baixo
        landmarks[16].y < landmarks[14].y && // anelar curvado para baixo
        landmarks[20].y < landmarks[18].y; // mindinho curvado para baixo

    // Verificando se o polegar está perto da boca
    const nearMouth =
        landmarks[4].y > landmarks[0].y && landmarks[4].y < landmarks[9].y; // polegar entre base da palma e linha do queixo

    // Verificando o movimento para frente
    let forwardMovement = false;
    if (lastLandmarks) {
        const deltaZ = lastLandmarks[0].z - landmarks[0].z; // diferença no eixo Z entre o último e o atual
        forwardMovement = deltaZ > 0.1; // movimento para frente se o valor de Z aumentar

        // Adicionando logs de depuração
        console.log(`lastLandmarks[0].z: ${lastLandmarks[0].z}, landmarks[0].z: ${landmarks[0].z}, deltaZ: ${deltaZ}`);
    }

    // Logs de depuração para as posições dos landmarks
    console.log(`palmOpen: ${palmOpen}`);
    console.log(`nearMouth: ${nearMouth}`);
    console.log(`forwardMovement: ${forwardMovement}`);

    return palmOpen && nearMouth && forwardMovement;
}



// Função para detectar "Sim"
export function gestoSim(landmarks) {
    const indicadorUp = landmarks[8].y < landmarks[6].y;  // Indicador levantado
    const medioDown = landmarks[12].y > landmarks[10].y;  // Médio abaixado
    const anelarDown = landmarks[16].y > landmarks[14].y; // Anelar abaixado
    const mindinhoDown = landmarks[20].y > landmarks[18].y; // Mindinho abaixado
    const polegarUp = landmarks[4].y < landmarks[3].y;  // Polegar levantado (pontas acima da articulação)

    // Para o gesto de "Sim", o indicador e o polegar devem estar levantados e os outros dedos abaixados
    return indicadorUp && medioDown && anelarDown && mindinhoDown && polegarUp;
}


// Função para detectar "Família"
export function gestoFamilia(landmarks) {
    const indicadorUp = landmarks[8].y < landmarks[6].y;
    const medioUp = landmarks[12].y < landmarks[10].y;
    const anelarDown = landmarks[16].y > landmarks[14].y;
    const mindinhoDown = landmarks[20].y > landmarks[18].y;
    return indicadorUp && medioUp && !anelarDown && !mindinhoDown;
}

export function gestoCasa(landmarks) {
    // Verifica se landmarks está definido e contém pelo menos 42 pontos
    if (!landmarks || landmarks.length < 42) {
        console.error("Landmarks não encontrados corretamente.");
        return false;
    }

    // Identificar as posições dos dedos nas duas mãos
    const thumbLeft = landmarks[4]; // Polegar da mão esquerda
    const indexLeft = landmarks[8]; // Indicador da mão esquerda
    const pinkyLeft = landmarks[20]; // Mínimo da mão esquerda
    
    const thumbRight = landmarks[24]; // Polegar da mão direita
    const indexRight = landmarks[28]; // Indicador da mão direita
    const pinkyRight = landmarks[20]; // Mínimo da mão direita

    // Verifique se os landmarks necessários estão presentes
    if (!thumbLeft || !indexLeft || !pinkyLeft || !thumbRight || !indexRight || !pinkyRight) {
        console.error("Landmarks de dedos não encontrados corretamente.");
        return false;
    }

    // Verificar se o polegar de uma mão está perto do indicador e do mínimo da outra
    const isThumbLeftCloseToIndexRight = Math.hypot(thumbLeft.x - indexRight.x, thumbLeft.y - indexRight.y) < 0.05;
    const isThumbLeftCloseToPinkyRight = Math.hypot(thumbLeft.x - pinkyRight.x, thumbLeft.y - pinkyRight.y) < 0.05;
    
    const isThumbRightCloseToIndexLeft = Math.hypot(thumbRight.x - indexLeft.x, thumbRight.y - indexLeft.y) < 0.05;
    const isThumbRightCloseToPinkyLeft = Math.hypot(thumbRight.x - pinkyLeft.x, thumbRight.y - pinkyLeft.y) < 0.05;

    // Retorna verdadeiro se ambos os polegares estiverem próximos dos indicadores e mínimos das mãos opostas
    return (isThumbLeftCloseToIndexRight && isThumbLeftCloseToPinkyRight) || 
           (isThumbRightCloseToIndexLeft && isThumbRightCloseToPinkyLeft);
}


// Função para detectar "Dinheiro"
export function gestoDinheiro(landmarks) {
    const indicadorUp = landmarks[8].y < landmarks[6].y;
    const medioUp = landmarks[12].y < landmarks[10].y;
    const anelarUp = landmarks[16].y < landmarks[14].y;
    const mindinhoUp = landmarks[20].y < landmarks[18].y;
    return indicadorUp && medioUp && anelarUp && mindinhoUp;
}

let lastDetectedGesto = ""; // Variável global para armazenar o último gesto detectado
let lastDetectionTime = 0; // Para controlar o tempo de detecção

export function detectGestoStable(landmarks, currentTime) {
    const GESTO_TIMEOUT = 500; // Tempo mínimo (em milissegundos) entre detecções de gestos

    // Se já se passou o tempo suficiente desde a última detecção, podemos verificar o gesto novamente
    if (currentTime - lastDetectionTime > GESTO_TIMEOUT) {
        let detectedGesto = "";

        if (gestoSim(landmarks)) {
            detectedGesto = "Sim";
        } else if (gestoFamilia(landmarks)) {
            detectedGesto = "Família";
        } else if (gestoCasa(landmarks)) {
            detectedGesto = "Casa";
        } else if (gestoDinheiro(landmarks)) {
            detectedGesto = "Dinheiro";
        } else if (gestoEuTeAmo(landmarks)) {
            detectedGesto = "Amor";
        } else if (gestoOi(landmarks)) {
            detectedGesto = "Oi";
        } else if (gestoObrigado(landmarks)) {
            detectedGesto = "Obrigado";
        } else {
            detectedGesto = "Aguardando gesto...";
        }

        // Verifica se o gesto detectado é o mesmo que o anterior
        if (detectedGesto !== lastDetectedGesto) {
            lastDetectedGesto = detectedGesto;
            lastDetectionTime = currentTime;
            return detectedGesto; // Retorna o gesto detectado
        }
    }
    return null; // Se o gesto não mudou ou não foi detectado, retorna nulo
}
