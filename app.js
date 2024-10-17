// Captura os elementos de vídeo e canvas da página
const elementoVideo = document.getElementById('videoInput');
const elementoCanvas = document.getElementById('outputCanvas');
const contextoCanvas = elementoCanvas.getContext('2d');

// Configurando o modelo MediaPipe Hands
const modeloMao = new Hands({
  locateFile: (arquivo) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${arquivo}`,
});

// Definindo as opções do modelo
modeloMao.setOptions({
  maxNumHands: 2,  // Detectar até 2 mãos
  minDetectionConfidence: 0.5,  // Nível mínimo de confiança para detectar
  minTrackingConfidence: 0.5,   // Nível mínimo de confiança para rastrear
});

// Função para processar os resultados do modelo
modeloMao.onResults((resultados) => {
  // Salva o contexto do canvas
  contextoCanvas.save();
  
  // Limpa o canvas antes de desenhar a nova detecção
  contextoCanvas.clearRect(0, 0, elementoCanvas.width, elementoCanvas.height);
  
  // Desenha o vídeo no canvas
  contextoCanvas.drawImage(
    resultados.image, 0, 0, elementoCanvas.width, elementoCanvas.height);
  
  // Se houver pontos detectados nas mãos
  if (resultados.multiHandLandmarks) {
    for (const pontosMao of resultados.multiHandLandmarks) {
      // Desenha as conexões entre os pontos (ossos da mão)
      drawConnectors(contextoCanvas, pontosMao, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
      
      // Desenha os pontos das articulações (dedos e palma)
      drawLandmarks(contextoCanvas, pontosMao, {color: '#FF0000', lineWidth: 2});
    }
  }

  // Restaura o contexto do canvas
  contextoCanvas.restore();
});

// Configura a câmera e inicia a captura do vídeo
const camera = new Camera(elementoVideo, {
  onFrame: async () => {
    // Envia cada frame de vídeo para o modelo processar
    await modeloMao.send({image: elementoVideo});
  },
  width: 1280,  // Largura da captura de vídeo
  height: 720   // Altura da captura de vídeo
});

// Inicia a câmera
camera.start();

