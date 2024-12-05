// gestos.js


// Função para detectar "Amor"
export function gestoAmor(landmarks) {
    const thumbUp = landmarks[4].y < landmarks[3].y;
    const indexUp = landmarks[8].y < landmarks[6].y;
    const pinkyUp = landmarks[20].y < landmarks[18].y;
    const middleDown = landmarks[12].y > landmarks[10].y;
    const ringDown = landmarks[16].y > landmarks[14].y;
    return thumbUp && indexUp && pinkyUp && middleDown && ringDown;
}


// Função para detectar "Oi"
export function gestoOi(landmarks) {
    const thumbAndIndexClose = Math.abs(landmarks[4].y - landmarks[8].y) < 0.05; // Polegar e indicador próximos
    const pinkyUp = landmarks[20].y < landmarks[18].y && landmarks[20].y < landmarks[16].y; // Mínimo levantado
    const middleDown = landmarks[12].y > landmarks[10].y; // Médio abaixado
    const ringDown = landmarks[16].y > landmarks[14].y; // Anelar abaixado
    return thumbAndIndexClose && pinkyUp && middleDown && ringDown;
}




// Função para detectar o gesto "A"
export function gestoA(landmarks) {
    const todosDobrado =
        landmarks[8].y > landmarks[6].y && // Indicador dobrado
        landmarks[12].y > landmarks[10].y && // Médio dobrado
        landmarks[16].y > landmarks[14].y && // Anelar dobrado
        landmarks[20].y > landmarks[18].y; // Mindinho dobrado


    const polegarLateral =
        Math.abs(landmarks[4].x - landmarks[2].x) < 0.1 && // Polegar ao lado da palma
        landmarks[4].y < landmarks[3].y; // Polegar levemente acima do punho


    return todosDobrado && polegarLateral;
}


// Função para detectar o gesto "B"
export function gestoB(landmarks) {
    const dedosEsticados =
        landmarks[8].y < landmarks[6].y && // Indicador esticado
        landmarks[12].y < landmarks[10].y && // Médio esticado
        landmarks[16].y < landmarks[14].y && // Anelar esticado
        landmarks[20].y < landmarks[18].y; // Mindinho esticado


    const polegarAbaixo =
        landmarks[4].y > landmarks[3].y && // Polegar abaixado
        Math.abs(landmarks[4].x - landmarks[3].x) < 0.1; // Polegar próximo à palma


    return dedosEsticados && polegarAbaixo;
}


// Função para detectar o gesto "C"
export function gestoC(landmarks) {
    const thresholdCurvatura = 0.2; // Limite para determinar a curvatura dos dedos
    const thresholdOrientacao = 0.1; // Limite para verificar a inclinação lateral da mão

    // Verifica se a mão está orientada de lado (maior variação em Z do que em X)
    const orientacaoHorizontal = Math.abs(landmarks[0].z - landmarks[5].z) > thresholdOrientacao;

    // Verifica se os dedos indicador, médio, anelar e mindinho estão curvados (formando a curva do "C")
    const indicadorCurvado = landmarks[8].x > landmarks[6].x && landmarks[8].y > landmarks[6].y;
    const medioCurvado = landmarks[12].x > landmarks[10].x && landmarks[12].y > landmarks[10].y;
    const anelarCurvado = landmarks[16].x > landmarks[14].x && landmarks[16].y > landmarks[14].y;
    const mindinhoCurvado = landmarks[20].x > landmarks[18].x && landmarks[20].y > landmarks[18].y;

    // Verifica a posição do polegar (aberto, mas formando o limite do "C")
    const polegarCurvado =
        Math.abs(landmarks[4].x - landmarks[2].x) > thresholdCurvatura && // Polegar afastado do indicador
        Math.abs(landmarks[4].y - landmarks[8].y) < 0.2; // Próximo à altura do indicador

    // Retorna verdadeiro se todos os critérios forem atendidos
    return (
        orientacaoHorizontal &&
        indicadorCurvado &&
        medioCurvado &&
        anelarCurvado &&
        mindinhoCurvado &&
        polegarCurvado
    );
}


// Função para detectar o gesto "D"
export function gestoD(landmarks) {
    const indicadorEsticado =
        landmarks[8].y < landmarks[6].y && // Indicador levantado
        Math.abs(landmarks[8].x - landmarks[6].x) < 0.1; // Indicador alinhado verticalmente


    const outrosDobrados =
        landmarks[12].y > landmarks[10].y && // Médio dobrado
        landmarks[16].y > landmarks[14].y && // Anelar dobrado
        landmarks[20].y > landmarks[18].y; // Mindinho dobrado





    return indicadorEsticado && outrosDobrados;
}


// Função para detectar o gesto "E"
export function gestoE(landmarks) {
    const thresholdCurvatura = 0.15; // Limite para definir se o dedo está dobrado

    const indicadorDobrado =
        landmarks[8].y > landmarks[6].y && // Indicador dobrado
        Math.abs(landmarks[8].x - landmarks[6].x) < thresholdCurvatura;

    const medioDobrado =
        landmarks[12].y > landmarks[10].y && // Médio dobrado
        Math.abs(landmarks[12].x - landmarks[10].x) < thresholdCurvatura;

    const anelarDobrado =
        landmarks[16].y > landmarks[14].y && // Anelar dobrado
        Math.abs(landmarks[16].x - landmarks[14].x) < thresholdCurvatura;

    const mindinhoDobrado =
        landmarks[20].y > landmarks[18].y && // Mindinho dobrado
        Math.abs(landmarks[20].x - landmarks[18].x) < thresholdCurvatura;

    const polegarEncostado =
        Math.abs(landmarks[4].x - landmarks[3].x) < 0.1 && // Polegar próximo à palma
        Math.abs(landmarks[4].y - landmarks[8].y) < 0.1; // Polegar encostando no indicador

    // Retorna verdadeiro apenas se todos os dedos estiverem dobrados
    return indicadorDobrado && medioDobrado && anelarDobrado && mindinhoDobrado && polegarEncostado;
}


// Variáveis para controle de detecção de gestos
let lastDetectedGesto = ""; // Armazena o último gesto detectado
let lastDetectionTime = 0; // Armazena o tempo da última detecção


// Função para detecção estável de gestos (com controle de tempo)
export function detectGestoStable(landmarks, currentTime) {
    const GESTO_TIMEOUT = 500; // Tempo mínimo (em milissegundos) entre detecções de gestos


    // Verifica se já passou o tempo suficiente desde a última detecção
    if (currentTime - lastDetectionTime > GESTO_TIMEOUT) {
        let detectedGesto = "";


        // Verifica qual gesto foi detectado
        if (gestoAmor(landmarks)) {
            detectedGesto = "Amor";
        } else if (gestoOi(landmarks)) {
            detectedGesto = "Oi";
        } else if (gestoA(landmarks)) {
            detectedGesto = "A";
        } else if (gestoB(landmarks)) {
            detectedGesto = "B";
        } else if (gestoC(landmarks)) {
            detectedGesto = "C";
        } else if (gestoD(landmarks)) {
            detectedGesto = "D";
        } else if (gestoE(landmarks)) {
            detectedGesto = "E";
        } else {
            detectedGesto = "Aguardando gesto..."; // Nenhum gesto detectado
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



