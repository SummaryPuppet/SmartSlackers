export type Choice = {
  text: string;
  emoji: string;
  points: number;      // 0–25 por escena (total máx 100)
  feedback: string;
  isGood: boolean;
};

export type SceneElement = {
  emoji: string;
  size: number;
  x: string;
  y: string;
  animate: "float" | "pulse" | "spin" | "none";
  zIndex?: number;
};

export type Scene = {
  id: number;
  chapter: string;
  situation: string;
  narrative: string;
  bg: string;
  elements: SceneElement[];
  prompt: string;
  choices: Choice[];
};

export type Simulation = {
  id: string;
  title: string;
  emoji: string;
  color: string;
  gradient: string;
  tagline: string;
  intro: string;
  scenes: Scene[];
};

export const simulations: Simulation[] = [
  // ─────────────────────────────────────────
  // MEDICINA
  // ─────────────────────────────────────────
  {
    id: "medicina",
    title: "Medicina Humana",
    emoji: "🩺",
    color: "#059669",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    tagline: "¿Tienes lo que se necesita para salvar vidas?",
    intro:
      "Son las 2:47 am en urgencias del Hospital Nacional. Acabas de completar tu décima hora de guardia. De repente suena la alarma — ambulancia entrante. Paciente crítico. Este es tu momento.",
    scenes: [
      {
        id: 1,
        chapter: "Escena 1: La emergencia",
        situation: "Llega un hombre de 55 años inconsciente, presión arterial cayendo, pulso débil.",
        narrative:
          "El equipo de ambulancias te entrega al paciente. Tiene la cara pálida, la respiración agitada. El monitor marca 80/40. La sala de urgencias está llena y tú eres el médico de turno. Todos te miran esperando una orden.",
        bg: "linear-gradient(160deg, #0f172a 0%, #134e4a 60%, #1e3a5f 100%)",
        elements: [
          { emoji: "🏥", size: 90, x: "5%", y: "5%", animate: "none", zIndex: 1 },
          { emoji: "🛏️", size: 100, x: "30%", y: "40%", animate: "none", zIndex: 2 },
          { emoji: "😰", size: 70, x: "38%", y: "30%", animate: "pulse", zIndex: 3 },
          { emoji: "📟", size: 55, x: "65%", y: "25%", animate: "pulse", zIndex: 2 },
          { emoji: "💉", size: 45, x: "75%", y: "55%", animate: "float", zIndex: 2 },
          { emoji: "👩‍⚕️", size: 65, x: "10%", y: "50%", animate: "none", zIndex: 3 },
          { emoji: "🚨", size: 40, x: "80%", y: "10%", animate: "pulse", zIndex: 1 },
          { emoji: "⚕️", size: 35, x: "55%", y: "65%", animate: "float", zIndex: 1 },
        ],
        prompt: "¿Qué haces primero?",
        choices: [
          {
            text: "Evalúas ABC: Vía aérea, respiración y circulación antes de actuar",
            emoji: "🔍",
            points: 25,
            feedback: "¡Perfecto! El protocolo ABCDE salva vidas. Tu equipo actúa con rapidez.",
            isGood: true,
          },
          {
            text: "Pides al equipo que prepare el desfibrilador inmediatamente",
            emoji: "⚡",
            points: 12,
            feedback: "Buena intención, pero sin diagnóstico previo podrías empeorar la situación.",
            isGood: false,
          },
          {
            text: "Llamas al jefe de guardia para que decida él",
            emoji: "📱",
            points: 5,
            feedback: "Perdes tiempo valioso. En urgencias, segundos cuestan vidas.",
            isGood: false,
          },
        ],
      },
      {
        id: 2,
        chapter: "Escena 2: El diagnóstico",
        situation: "Estabilizaste al paciente. Ahora debes descubrir qué le ocurre.",
        narrative:
          "El paciente tiene dolor en el pecho irradiado al brazo izquierdo, sudoración fría y náuseas. El electrocardiograma llega con cambios en el segmento ST. El laboratorio tarda 20 minutos. Cada minuto de músculo cardíaco perdido no vuelve.",
        bg: "linear-gradient(160deg, #1e3a5f 0%, #0f2742 60%, #0c1a2e 100%)",
        elements: [
          { emoji: "📊", size: 80, x: "60%", y: "10%", animate: "none", zIndex: 2 },
          { emoji: "❤️", size: 85, x: "35%", y: "30%", animate: "pulse", zIndex: 3 },
          { emoji: "🩺", size: 60, x: "10%", y: "40%", animate: "float", zIndex: 2 },
          { emoji: "💊", size: 45, x: "70%", y: "50%", animate: "float", zIndex: 2 },
          { emoji: "🔬", size: 55, x: "20%", y: "20%", animate: "none", zIndex: 1 },
          { emoji: "😓", size: 60, x: "45%", y: "55%", animate: "pulse", zIndex: 3 },
          { emoji: "⏱️", size: 50, x: "80%", y: "30%", animate: "spin", zIndex: 1 },
        ],
        prompt: "¿Cuál es tu diagnóstico y acción?",
        choices: [
          {
            text: "Diagnóstico clínico: IAM. Activas protocolo de infarto sin esperar lab",
            emoji: "💡",
            points: 25,
            feedback: "¡Excelente decisión clínica! El tiempo es músculo. El paciente llega a sala de hemodinamia a tiempo.",
            isGood: true,
          },
          {
            text: "Esperas el resultado de laboratorio para confirmar antes de actuar",
            emoji: "⏳",
            points: 8,
            feedback: "El retraso causó mayor daño al miocardio. En infartos, el tiempo es crítico.",
            isGood: false,
          },
          {
            text: "Llamas al cardiólogo para que te confirme el diagnóstico",
            emoji: "📞",
            points: 15,
            feedback: "Buena comunicación, pero pierdes tiempo. El cardiólogo confirma y lo felicita por haber actuado antes.",
            isGood: false,
          },
        ],
      },
      {
        id: 3,
        chapter: "Escena 3: La sala de operaciones",
        situation: "El paciente necesita una angioplastia de urgencia. Eres parte del equipo.",
        narrative:
          "Estás dentro del quirófano. Las luces sobre la mesa, el ruido del monitor cardíaco, el silencio tenso del equipo. El paciente está bajo anestesia. El catéter está a punto de llegar a la arteria bloqueada. De repente el monitor marca arritmia.",
        bg: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        elements: [
          { emoji: "🔦", size: 80, x: "45%", y: "5%", animate: "pulse", zIndex: 3 },
          { emoji: "🛏️", size: 110, x: "30%", y: "40%", animate: "none", zIndex: 2 },
          { emoji: "💗", size: 60, x: "65%", y: "20%", animate: "pulse", zIndex: 3 },
          { emoji: "🩺", size: 55, x: "10%", y: "30%", animate: "float", zIndex: 2 },
          { emoji: "👨‍⚕️", size: 70, x: "15%", y: "50%", animate: "none", zIndex: 3 },
          { emoji: "👩‍⚕️", size: 65, x: "68%", y: "50%", animate: "none", zIndex: 3 },
          { emoji: "⚡", size: 50, x: "80%", y: "35%", animate: "pulse", zIndex: 1 },
          { emoji: "🔧", size: 40, x: "50%", y: "65%", animate: "float", zIndex: 1 },
        ],
        prompt: "El monitor marca arritmia ventricular. ¿Cómo respondes?",
        choices: [
          {
            text: "Ordenas desfibrilación inmediata y continúas el procedimiento",
            emoji: "⚡",
            points: 25,
            feedback: "¡Reacción perfecta bajo presión! El equipo desfibriló a tiempo y el corazón retomó ritmo sinusal.",
            isGood: true,
          },
          {
            text: "Pausas el procedimiento y esperas a ver si la arritmia se autorresuelve",
            emoji: "⏸️",
            points: 10,
            feedback: "La espera fue arriesgada. Afortunadamente se resolvió sola, pero no siempre ocurre así.",
            isGood: false,
          },
          {
            text: "Le pides al anestesiólogo que maneje la arritmia mientras tú sigues",
            emoji: "🤝",
            points: 18,
            feedback: "Buena coordinación de equipo, aunque idealmente debiste liderar la decisión.",
            isGood: false,
          },
        ],
      },
      {
        id: 4,
        chapter: "Escena 4: La familia espera",
        situation: "La operación fue exitosa. La familia te espera con angustia.",
        narrative:
          "Sales del quirófano después de 4 horas. En la sala de espera hay una esposa llorando, dos hijos adultos y una madre anciana. Están aterrados. Tú eres el primero que sale a hablar con ellos. Tu cara lo dice todo antes de que abras la boca.",
        bg: "linear-gradient(160deg, #134e4a 0%, #065f46 60%, #022c22 100%)",
        elements: [
          { emoji: "🏥", size: 75, x: "5%", y: "5%", animate: "none", zIndex: 1 },
          { emoji: "👨‍⚕️", size: 80, x: "40%", y: "20%", animate: "none", zIndex: 3 },
          { emoji: "👨‍👩‍👧‍👦", size: 90, x: "60%", y: "40%", animate: "none", zIndex: 2 },
          { emoji: "😢", size: 50, x: "70%", y: "25%", animate: "float", zIndex: 2 },
          { emoji: "💚", size: 55, x: "20%", y: "55%", animate: "pulse", zIndex: 1 },
          { emoji: "🌟", size: 40, x: "85%", y: "15%", animate: "float", zIndex: 1 },
        ],
        prompt: "¿Cómo le das la noticia a la familia?",
        choices: [
          {
            text: "Vas directo: 'La operación fue exitosa. Él está vivo y estable'",
            emoji: "💚",
            points: 25,
            feedback: "La claridad compasiva es la mejor comunicación médica. La familia llora de alivio.",
            isGood: true,
          },
          {
            text: "Explicas todos los detalles técnicos de la operación primero",
            emoji: "📋",
            points: 10,
            feedback: "La familia no procesa tecnicismos bajo estrés. Lo que necesitaban era saber si vivía.",
            isGood: false,
          },
          {
            text: "Mandas a la enfermera a dar la noticia porque ya estás agotado",
            emoji: "😓",
            points: 3,
            feedback: "La comunicación de resultados quirúrgicos es responsabilidad del médico tratante.",
            isGood: false,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // INGENIERÍA CIVIL
  // ─────────────────────────────────────────
  {
    id: "ingenieria-civil",
    title: "Ingeniería Civil",
    emoji: "🏗️",
    color: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626, #f97316)",
    tagline: "¿Puedes construir el futuro de una nación?",
    intro:
      "Tu empresa acaba de ganar la licitación para construir un edificio de 8 pisos en Miraflores. Presupuesto: S/. 4.5 millones. Plazo: 18 meses. Este proyecto puede lanzar tu carrera... o hundirla. Todo depende de tus decisiones.",
    scenes: [
      {
        id: 1,
        chapter: "Escena 1: Los planos",
        situation: "Revisas los planos estructurales y encuentras algo que no cuadra.",
        narrative:
          "Son las 9am del primer día. Abres los planos en la pantalla grande de la oficina técnica. Después de 2 horas de revisión, encuentras que los cálculos de carga para el cuarto piso no coinciden con el tipo de suelo reportado en el estudio geotécnico. Si construyes así, el edificio podría tener problemas.",
        bg: "linear-gradient(160deg, #1c1917 0%, #292524 60%, #1c1917 100%)",
        elements: [
          { emoji: "📐", size: 80, x: "10%", y: "15%", animate: "none", zIndex: 2 },
          { emoji: "🖥️", size: 90, x: "45%", y: "20%", animate: "none", zIndex: 3 },
          { emoji: "📏", size: 65, x: "70%", y: "40%", animate: "float", zIndex: 2 },
          { emoji: "⚠️", size: 70, x: "55%", y: "10%", animate: "pulse", zIndex: 3 },
          { emoji: "📋", size: 55, x: "20%", y: "55%", animate: "none", zIndex: 2 },
          { emoji: "🔍", size: 50, x: "80%", y: "20%", animate: "float", zIndex: 1 },
          { emoji: "👷", size: 65, x: "5%", y: "45%", animate: "none", zIndex: 3 },
        ],
        prompt: "¿Qué haces con el error en los planos?",
        choices: [
          {
            text: "Paras todo, documentas el error y convocas reunión urgente con el calculista",
            emoji: "🛑",
            points: 25,
            feedback: "¡Decisión correcta! El error se corrigió antes de excavar. Se evitó un desastre estructural.",
            isGood: true,
          },
          {
            text: "Ajustas los números tú mismo para no retrasar el proyecto",
            emoji: "✏️",
            points: 5,
            feedback: "Modificar planos estructurales sin ser el calculista responsable es una falta grave y peligrosa.",
            isGood: false,
          },
          {
            text: "Continúas la obra y reportas el problema en el siguiente informe mensual",
            emoji: "📅",
            points: 3,
            feedback: "Un error estructural no detectado a tiempo causó grietas en el 4to piso meses después. Costó el doble corregirlo.",
            isGood: false,
          },
        ],
      },
      {
        id: 2,
        chapter: "Escena 2: La excavación",
        situation: "Al excavar encuentran restos arqueológicos bajo el suelo.",
        narrative:
          "El excavador detiene la retroexcavadora. A 2 metros de profundidad aparecen fragmentos de cerámica y muros antiguos. El capataz te llama al hoyo. Tu cliente te presiona por WhatsApp: 'No pares la obra, tenemos plazo.' El Ministerio de Cultura dice que si denuncias, la obra se paraliza 3 meses mínimo.",
        bg: "linear-gradient(160deg, #3f1c00 0%, #7c2d12 50%, #431407 100%)",
        elements: [
          { emoji: "🏺", size: 75, x: "40%", y: "45%", animate: "none", zIndex: 3 },
          { emoji: "⛏️", size: 70, x: "15%", y: "30%", animate: "float", zIndex: 2 },
          { emoji: "🚧", size: 60, x: "65%", y: "15%", animate: "none", zIndex: 2 },
          { emoji: "👷", size: 65, x: "5%", y: "50%", animate: "none", zIndex: 3 },
          { emoji: "📱", size: 45, x: "75%", y: "45%", animate: "pulse", zIndex: 2 },
          { emoji: "🏛️", size: 80, x: "55%", y: "35%", animate: "none", zIndex: 1 },
          { emoji: "😰", size: 50, x: "80%", y: "25%", animate: "float", zIndex: 2 },
        ],
        prompt: "¿Qué haces con los restos arqueológicos?",
        choices: [
          {
            text: "Paralizas la excavación y llamas al Ministerio de Cultura inmediatamente",
            emoji: "📞",
            points: 25,
            feedback: "¡Hiciste lo correcto legalmente y éticamente. El hallazgo fue notable y la empresa ganó prestigio por su responsabilidad.",
            isGood: true,
          },
          {
            text: "Retiras los restos discretamente y sigues la excavación sin reportar",
            emoji: "🙈",
            points: 0,
            feedback: "Esto es un delito. Semanas después un inspector detectó el movimiento de tierra sospechoso y la empresa fue multada.",
            isGood: false,
          },
          {
            text: "Tomas fotos, las guardas y consultas con tu jefe antes de decidir",
            emoji: "📸",
            points: 15,
            feedback: "Bien documentado, pero el retraso en reportar fue cuestionado. Lo legal es reportar de inmediato.",
            isGood: false,
          },
        ],
      },
      {
        id: 3,
        chapter: "Escena 3: El accidente",
        situation: "Un obrero cae desde el andamio del tercer piso.",
        narrative:
          "Es un martes por la tarde. Escuchas un grito y un golpe seco. Miguel, el fierrero de 34 años y padre de tres hijos, cayó desde 8 metros. Está consciente pero con dolor intenso en la pierna. La obra queda paralizada. El resto del equipo te mira. Debes actuar.",
        bg: "linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
        elements: [
          { emoji: "🏗️", size: 100, x: "45%", y: "5%", animate: "none", zIndex: 1 },
          { emoji: "🚑", size: 75, x: "65%", y: "50%", animate: "pulse", zIndex: 3 },
          { emoji: "😣", size: 65, x: "30%", y: "45%", animate: "none", zIndex: 3 },
          { emoji: "👷", size: 60, x: "10%", y: "30%", animate: "none", zIndex: 2 },
          { emoji: "⛑️", size: 55, x: "70%", y: "20%", animate: "float", zIndex: 2 },
          { emoji: "🚨", size: 50, x: "5%", y: "60%", animate: "pulse", zIndex: 2 },
          { emoji: "📋", size: 40, x: "85%", y: "40%", animate: "none", zIndex: 1 },
        ],
        prompt: "¿Cuál es tu primera acción?",
        choices: [
          {
            text: "Llamas ambulancia, no mueves al herido y activas el protocolo de emergencias",
            emoji: "🚑",
            points: 25,
            feedback: "Reacción correcta. Miguel fue atendido a tiempo. Fractura expuesta pero sin lesión medular gracias a que no lo movieron.",
            isGood: true,
          },
          {
            text: "Pides a compañeros que lleven al herido en el carro al hospital más cercano",
            emoji: "🚗",
            points: 5,
            feedback: "Mover a una persona con posible lesión espinal sin inmovilización puede generar parálisis permanente.",
            isGood: false,
          },
          {
            text: "Primero llamas al dueño de la empresa para saber cómo proceder",
            emoji: "📲",
            points: 8,
            feedback: "Perdes minutos valiosos. La vida del trabajador no puede esperar a una decisión gerencial.",
            isGood: false,
          },
        ],
      },
      {
        id: 4,
        chapter: "Escena 4: La entrega final",
        situation: "El edificio está terminado. Llega la inspección técnica municipal.",
        narrative:
          "Han pasado 18 meses. El edificio de 8 pisos está listo. El inspector municipal llega con su lista de verificación. Revisa la documentación, los materiales, las instalaciones. Entonces te señala un detalle: la rampa para discapacitados no cumple el ángulo mínimo reglamentario. Si aprueba así, la municipalidad puede multarte.",
        bg: "linear-gradient(160deg, #0c4a6e 0%, #075985 60%, #0369a1 100%)",
        elements: [
          { emoji: "🏢", size: 100, x: "40%", y: "5%", animate: "none", zIndex: 2 },
          { emoji: "👷", size: 70, x: "10%", y: "40%", animate: "none", zIndex: 3 },
          { emoji: "📋", size: 65, x: "65%", y: "30%", animate: "none", zIndex: 2 },
          { emoji: "🔍", size: 55, x: "75%", y: "50%", animate: "float", zIndex: 2 },
          { emoji: "♿", size: 60, x: "30%", y: "55%", animate: "pulse", zIndex: 3 },
          { emoji: "✅", size: 50, x: "80%", y: "15%", animate: "float", zIndex: 1 },
        ],
        prompt: "¿Cómo resuelves el problema con la rampa?",
        choices: [
          {
            text: "Reconoces el error, pides plazo de 5 días hábiles y corriges la rampa",
            emoji: "🔧",
            points: 25,
            feedback: "¡Actitud profesional! La corrección tomó 4 días. El inspector aprobó el edificio con elogios por tu honestidad.",
            isGood: true,
          },
          {
            text: "Le ofreces al inspector una 'propina' para que ignore el detalle",
            emoji: "💵",
            points: 0,
            feedback: "Acto de corrupción. El inspector era un auditor anticorrupción. La empresa fue sancionada.",
            isGood: false,
          },
          {
            text: "Argumentas que el ángulo es suficiente y presentas cálculos improvisados",
            emoji: "🗣️",
            points: 10,
            feedback: "El inspector no se convenció. Igual tuviste que corregir la rampa, pero ya habías perdido credibilidad.",
            isGood: false,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // GASTRONOMÍA
  // ─────────────────────────────────────────
  {
    id: "gastronomia",
    title: "Gastronomía",
    emoji: "👨‍🍳",
    color: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626, #ea580c)",
    tagline: "¿Tienes el fuego para conquistar los sabores del Perú?",
    intro:
      "Acabas de entrar como chef de partida a uno de los mejores restaurantes de Lima. El chef principal acaba de ganar un reconocimiento internacional. Esta noche hay 80 comensales reservados, varios críticos gastronómicos entre ellos. Tu misión: no decepcionar.",
    scenes: [
      {
        id: 1,
        chapter: "Escena 1: La mise en place",
        situation: "Faltan 2 horas para el servicio y falta el insumo principal.",
        narrative:
          "Son las 5pm. Revisas el inventario y descubres que el lenguado fresco que necesitas para el plato estrella de la noche no llegó. El proveedor no responde el teléfono. En 2 horas llegarán los comensales y el lenguado es el principal del menú de degustación que ya está impreso y enviado.",
        bg: "linear-gradient(160deg, #7f1d1d 0%, #991b1b 60%, #7f1d1d 100%)",
        elements: [
          { emoji: "🍳", size: 85, x: "40%", y: "30%", animate: "none", zIndex: 3 },
          { emoji: "🐟", size: 70, x: "65%", y: "20%", animate: "float", zIndex: 2 },
          { emoji: "❌", size: 55, x: "72%", y: "12%", animate: "pulse", zIndex: 3 },
          { emoji: "👨‍🍳", size: 75, x: "10%", y: "40%", animate: "none", zIndex: 3 },
          { emoji: "🔪", size: 50, x: "30%", y: "60%", animate: "none", zIndex: 2 },
          { emoji: "🌶️", size: 45, x: "75%", y: "55%", animate: "float", zIndex: 1 },
          { emoji: "⏰", size: 60, x: "20%", y: "15%", animate: "pulse", zIndex: 2 },
        ],
        prompt: "¿Cómo resuelves el faltante de lenguado?",
        choices: [
          {
            text: "Llamas a 3 proveedores alternativos y redesignas el plato con corvina fresca",
            emoji: "🔄",
            points: 25,
            feedback: "¡Creatividad bajo presión! La corvina fue aún mejor recibida. Los críticos elogiaron la textura.",
            isGood: true,
          },
          {
            text: "Usas el lenguado congelado que hay en la cámara y no le dices a nadie",
            emoji: "🤫",
            points: 5,
            feedback: "Un crítico notó la diferencia en la textura. Publicó en su blog que el producto no era fresco.",
            isGood: false,
          },
          {
            text: "Informas al chef principal y al gerente, propones cambiar el plato del menú",
            emoji: "🗣️",
            points: 20,
            feedback: "Buena comunicación. El chef te felicitó por avisar a tiempo y juntos diseñaron el nuevo plato.",
            isGood: false,
          },
        ],
      },
      {
        id: 2,
        chapter: "Escena 2: El servicio",
        situation: "El restaurante está lleno. Surge una comanda imposible.",
        narrative:
          "El salón está a tope. Cada plato sale perfecto. De repente llega una comanda especial: un comensal tiene alergia al mariscos, intolerancia al gluten Y es vegetariano. Quiere el menú de degustación completo adaptado. El mesero te dice que es el editor de la guía gastronómica más importante del Perú.",
        bg: "linear-gradient(160deg, #92400e 0%, #b45309 60%, #78350f 100%)",
        elements: [
          { emoji: "🍽️", size: 80, x: "40%", y: "25%", animate: "none", zIndex: 3 },
          { emoji: "👨‍🍳", size: 75, x: "10%", y: "40%", animate: "none", zIndex: 3 },
          { emoji: "🥗", size: 65, x: "65%", y: "35%", animate: "float", zIndex: 2 },
          { emoji: "⚠️", size: 55, x: "25%", y: "20%", animate: "pulse", zIndex: 2 },
          { emoji: "🌿", size: 45, x: "75%", y: "55%", animate: "float", zIndex: 1 },
          { emoji: "⭐", size: 50, x: "80%", y: "15%", animate: "pulse", zIndex: 2 },
          { emoji: "🍋", size: 40, x: "55%", y: "60%", animate: "float", zIndex: 1 },
        ],
        prompt: "¿Cómo manejas esta comanda especial?",
        choices: [
          {
            text: "Aceptas el reto, adaptas cada plato del menú con ingredientes alternativos creativos",
            emoji: "✨",
            points: 25,
            feedback: "¡Maestría! El editor quedó impresionado. El restaurante apareció en la portada de la guía.",
            isGood: true,
          },
          {
            text: "Le dices que el menú degustación no puede modificarse y le ofreces la carta regular",
            emoji: "🚫",
            points: 8,
            feedback: "El editor publicó que el restaurante 'carece de flexibilidad para restricciones alimentarias'.",
            isGood: false,
          },
          {
            text: "Delegas la comanda al sous chef porque estás muy ocupado",
            emoji: "👉",
            points: 12,
            feedback: "El sous chef hizo un trabajo aceptable, pero sin tu toque maestro el plato fue ordinario.",
            isGood: false,
          },
        ],
      },
      {
        id: 3,
        chapter: "Escena 3: La queja",
        situation: "Un comensal devuelve el plato diciendo que está frío y sin sabor.",
        narrative:
          "Mesa 12. El mesonero regresa con el ceviche intacto. El cliente, visiblemente molesto, dice que 'el ceviche está aguado y sin sazón'. Tú mismo preparaste ese ceviche hace 8 minutos. El ceviche era perfecto, lo probaste. La mesa de al lado, con el mismo plato, está encantada.",
        bg: "linear-gradient(160deg, #1e3a5f 0%, #1e40af 50%, #1d4ed8 100%)",
        elements: [
          { emoji: "🍋", size: 70, x: "35%", y: "30%", animate: "none", zIndex: 3 },
          { emoji: "🐟", size: 65, x: "55%", y: "20%", animate: "float", zIndex: 2 },
          { emoji: "😤", size: 60, x: "70%", y: "45%", animate: "pulse", zIndex: 3 },
          { emoji: "👨‍🍳", size: 70, x: "10%", y: "40%", animate: "none", zIndex: 3 },
          { emoji: "🌶️", size: 45, x: "20%", y: "20%", animate: "float", zIndex: 1 },
          { emoji: "💬", size: 50, x: "80%", y: "25%", animate: "float", zIndex: 2 },
        ],
        prompt: "¿Cómo respondes a la queja?",
        choices: [
          {
            text: "Sales a la mesa, escuchas al cliente con respeto y le ofreces un nuevo plato sin costo",
            emoji: "🤝",
            points: 25,
            feedback: "El cliente quedó sorprendido por la atención personal del chef. Terminó pidiendo postre y dejó propina generosa.",
            isGood: true,
          },
          {
            text: "Mandas al mesero a decirle que el ceviche estaba perfecto y que es su paladar",
            emoji: "🙅",
            points: 0,
            feedback: "El cliente hizo una reseña de 1 estrella en Google. Nunca discutas con un cliente sobre su percepción.",
            isGood: false,
          },
          {
            text: "Le preparas otro ceviche con un poco más de limón y sal para complacerle",
            emoji: "🔄",
            points: 15,
            feedback: "Fue un gesto correcto, aunque no saliste a hablar con él personalmente, perdiste la oportunidad de conectar.",
            isGood: false,
          },
        ],
      },
      {
        id: 4,
        chapter: "Escena 4: El concurso",
        situation: "Te nominan para representar al restaurante en el Concurso Nacional de Cocina.",
        narrative:
          "El chef principal te elige a ti para representar al restaurante en el Concurso Nacional. Tienes que crear un plato innovador que represente la cocina peruana en 45 minutos con ingredientes sorpresa. Cuando abres la caja de ingredientes: papa nativa morada, trucha del Titicaca, chicha de jora y chocolate de Cusco.",
        bg: "linear-gradient(160deg, #064e3b 0%, #065f46 60%, #022c22 100%)",
        elements: [
          { emoji: "🥇", size: 80, x: "45%", y: "5%", animate: "pulse", zIndex: 3 },
          { emoji: "👨‍🍳", size: 85, x: "15%", y: "30%", animate: "none", zIndex: 3 },
          { emoji: "🐟", size: 65, x: "60%", y: "35%", animate: "float", zIndex: 2 },
          { emoji: "🥔", size: 55, x: "75%", y: "20%", animate: "float", zIndex: 2 },
          { emoji: "🍫", size: 50, x: "25%", y: "60%", animate: "float", zIndex: 1 },
          { emoji: "⏱️", size: 60, x: "80%", y: "50%", animate: "spin", zIndex: 2 },
          { emoji: "🌟", size: 45, x: "5%", y: "15%", animate: "pulse", zIndex: 1 },
        ],
        prompt: "¿Cuál es tu concepto para el plato?",
        choices: [
          {
            text: "Trucha a baja temperatura con crema de papa morada, reducción de chicha y ganache de chocolate cusqueño",
            emoji: "✨",
            points: 25,
            feedback: "¡GANASTE! El jurado destacó 'la fusión de sabores andinos con técnica de alta cocina moderna'. Oro para el restaurante.",
            isGood: true,
          },
          {
            text: "Ceviche de trucha con papa morada frita, porque es lo que mejor sabes hacer",
            emoji: "🐟",
            points: 12,
            feedback: "Técnicamente correcto pero predecible. Quedaste en tercer lugar. El jurado esperaba más innovación.",
            isGood: false,
          },
          {
            text: "Un postre con chocolate y papa para sorprender con algo dulce e inesperado",
            emoji: "🍮",
            points: 18,
            feedback: "Idea arriesgada pero interesante. El jurado reconoció la creatividad aunque la ejecución fue irregular.",
            isGood: false,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // DERECHO
  // ─────────────────────────────────────────
  {
    id: "derecho",
    title: "Derecho",
    emoji: "⚖️",
    color: "#b45309",
    gradient: "linear-gradient(135deg, #b45309, #d97706)",
    tagline: "¿Puedes defender la verdad bajo presión?",
    intro:
      "Eres un joven abogado en tu primer caso importante. Tu cliente, una madre de familia, es acusada injustamente de apropiación ilícita por su ex empleador. Tienes 72 horas para armar la defensa. Si pierdes, ella pierde su trabajo y su reputación. Si ganas, demuestras de qué estás hecho.",
    scenes: [
      {
        id: 1,
        chapter: "Escena 1: El expediente",
        situation: "Revisas el expediente y encuentras una prueba que nadie vio.",
        narrative:
          "Son las 11pm y estás en la oficina con el expediente de 400 páginas. En la página 287, casi al final, encuentras un correo electrónico donde el mismo gerente de la empresa admite en una conversación interna que 'el dinero salió por error del sistema contable, no fue ella'. Nadie en el caso vio ese correo.",
        bg: "linear-gradient(160deg, #292524 0%, #44403c 60%, #292524 100%)",
        elements: [
          { emoji: "⚖️", size: 80, x: "45%", y: "10%", animate: "none", zIndex: 2 },
          { emoji: "📚", size: 85, x: "15%", y: "30%", animate: "none", zIndex: 3 },
          { emoji: "💡", size: 65, x: "65%", y: "35%", animate: "pulse", zIndex: 3 },
          { emoji: "📧", size: 60, x: "55%", y: "55%", animate: "float", zIndex: 2 },
          { emoji: "🔍", size: 55, x: "25%", y: "60%", animate: "float", zIndex: 2 },
          { emoji: "🌙", size: 45, x: "80%", y: "10%", animate: "none", zIndex: 1 },
          { emoji: "☕", size: 40, x: "5%", y: "60%", animate: "none", zIndex: 1 },
        ],
        prompt: "¿Qué haces con la prueba que encontraste?",
        choices: [
          {
            text: "La documentas formalmente, la adjuntas al expediente y la presentas como prueba nueva",
            emoji: "📋",
            points: 25,
            feedback: "¡Brillante! El juez admitió la prueba. La defensa tomó un giro total a favor de tu clienta.",
            isGood: true,
          },
          {
            text: "Llamas al gerente de la empresa para 'negociar' antes de presentar la prueba",
            emoji: "📞",
            points: 5,
            feedback: "Eso bordeó la extorsión. El abogado contrario presentó una queja de conducta contra ti.",
            isGood: false,
          },
          {
            text: "La guardas como as bajo la manga y la usas por sorpresa el día del juicio",
            emoji: "🃏",
            points: 15,
            feedback: "La estrategia fue audaz pero el juez cuestionó por qué no fue presentada antes. Igualmente ayudó.",
            isGood: false,
          },
        ],
      },
      {
        id: 2,
        chapter: "Escena 2: La audiencia",
        situation: "El abogado contrario presenta un testigo que miente bajo juramento.",
        narrative:
          "Estás en la audiencia. El abogado de la empresa presenta a un contador como testigo que afirma haber 'visto a tu clienta llevarse el dinero'. Pero tú sabes que ese contador fue despedido de la empresa hace 6 meses por problemas éticos. El juez lo está creyendo.",
        bg: "linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #1e1b4b 100%)",
        elements: [
          { emoji: "🏛️", size: 90, x: "40%", y: "5%", animate: "none", zIndex: 1 },
          { emoji: "👨‍⚖️", size: 80, x: "40%", y: "20%", animate: "none", zIndex: 3 },
          { emoji: "🤥", size: 65, x: "65%", y: "40%", animate: "pulse", zIndex: 3 },
          { emoji: "⚖️", size: 60, x: "20%", y: "35%", animate: "none", zIndex: 2 },
          { emoji: "😤", size: 55, x: "10%", y: "55%", animate: "float", zIndex: 2 },
          { emoji: "📄", size: 50, x: "75%", y: "55%", animate: "float", zIndex: 1 },
        ],
        prompt: "¿Cómo rebates al testigo falso?",
        choices: [
          {
            text: "Pides la palabra, presentas el legajo de despido del contador y lo interrogas sobre eso",
            emoji: "🗂️",
            points: 25,
            feedback: "¡Contrainterrogatorio perfecto! El testigo se contradijo. El juez le restó credibilidad ante todos.",
            isGood: true,
          },
          {
            text: "Interrumpes al testigo a gritos diciendo que está mintiendo",
            emoji: "😡",
            points: 3,
            feedback: "El juez te llamó al orden y desestimó tu objeción. Perdes credibilidad ante el tribunal.",
            isGood: false,
          },
          {
            text: "Esperas a la réplica final para desmentirlo con argumentos escritos",
            emoji: "✍️",
            points: 12,
            feedback: "El daño estaba hecho. El juez ya tenía una impresión del testigo. Debiste actuar en el momento.",
            isGood: false,
          },
        ],
      },
      {
        id: 3,
        chapter: "Escena 3: La oferta",
        situation: "El abogado contrario te llama a negociar fuera del juzgado.",
        narrative:
          "En el pasillo del juzgado, el abogado de la empresa se acerca y te dice en voz baja: 'Mira, mi cliente ofrece pagarle a tu clienta 2 sueldos y archivar el caso si retiras la prueba del correo. Ella no va a pagar costas, queda libre. ¿Qué dices?' Tu clienta necesita el dinero. Pero ese correo probaría que es totalmente inocente.",
        bg: "linear-gradient(160deg, #3f1c00 0%, #7c2d12 50%, #3f1c00 100%)",
        elements: [
          { emoji: "💼", size: 75, x: "60%", y: "25%", animate: "none", zIndex: 2 },
          { emoji: "💰", size: 70, x: "30%", y: "40%", animate: "float", zIndex: 3 },
          { emoji: "🤝", size: 65, x: "55%", y: "50%", animate: "none", zIndex: 2 },
          { emoji: "🤔", size: 60, x: "10%", y: "30%", animate: "float", zIndex: 3 },
          { emoji: "⚖️", size: 55, x: "80%", y: "45%", animate: "none", zIndex: 1 },
          { emoji: "🧭", size: 50, x: "20%", y: "60%", animate: "pulse", zIndex: 2 },
        ],
        prompt: "¿Qué le respondes?",
        choices: [
          {
            text: "Consultas con tu clienta, ella decide rechazar — quiere que conste que es inocente",
            emoji: "🙅",
            points: 25,
            feedback: "La decisión fue de ella, como corresponde. Siguieron adelante y ganaron el caso limpiamente.",
            isGood: true,
          },
          {
            text: "Aceptas la oferta sin consultar a tu clienta para cerrar rápido",
            emoji: "✅",
            points: 0,
            feedback: "Tomar decisiones sin el consentimiento del cliente es una falta ética grave. Tu clienta te demandó a ti.",
            isGood: false,
          },
          {
            text: "Rechazas de plano sin ni siquiera consultar a tu clienta",
            emoji: "❌",
            points: 12,
            feedback: "La decisión de aceptar o no una oferta es siempre del cliente, no del abogado. Faltaste al procedimiento.",
            isGood: false,
          },
        ],
      },
      {
        id: 4,
        chapter: "Escena 4: El veredicto",
        situation: "El juez está por leer el fallo final. El ambiente es tenso.",
        narrative:
          "Todos están de pie en la sala. El juez toma sus lentes, abre el expediente. Tu clienta te aprieta el brazo. El abogado contrario sonríe con confianza. Tú recuerdas las 72 horas de trabajo, las noches sin dormir, el correo que encontraste en la página 287. El juez empieza a leer.",
        bg: "linear-gradient(160deg, #0c4a6e 0%, #075985 60%, #0369a1 100%)",
        elements: [
          { emoji: "👨‍⚖️", size: 85, x: "40%", y: "10%", animate: "none", zIndex: 3 },
          { emoji: "🏛️", size: 90, x: "40%", y: "5%", animate: "none", zIndex: 1 },
          { emoji: "⚖️", size: 70, x: "15%", y: "40%", animate: "none", zIndex: 2 },
          { emoji: "😰", size: 60, x: "68%", y: "40%", animate: "pulse", zIndex: 3 },
          { emoji: "📋", size: 55, x: "80%", y: "20%", animate: "none", zIndex: 2 },
          { emoji: "🤞", size: 50, x: "25%", y: "60%", animate: "float", zIndex: 2 },
        ],
        prompt: "El juez dice 'La parte demandada queda...' ¿Qué sientes en ese momento?",
        choices: [
          {
            text: "Calma absoluta — hiciste todo correctamente y confías en las pruebas",
            emoji: "😌",
            points: 25,
            feedback: "ABSUELTA. El juez cita el correo como prueba determinante. Tu clienta llora de alegría. Tú también.",
            isGood: true,
          },
          {
            text: "Nerviosismo extremo — no estabas seguro de haber hecho suficiente",
            emoji: "😰",
            points: 15,
            feedback: "ABSUELTA. Aunque ganaste, la falta de confianza en tu trabajo te desgastó innecesariamente.",
            isGood: false,
          },
          {
            text: "Ya estás pensando en la apelación si pierdes",
            emoji: "🔄",
            points: 18,
            feedback: "ABSUELTA. Pensar en contingencias es inteligente, pero también confía en tu trabajo previo.",
            isGood: false,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // INGENIERÍA DE SOFTWARE
  // ─────────────────────────────────────────
  {
    id: "software",
    title: "Ingeniería de Software",
    emoji: "💻",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    tagline: "¿Puedes resolver problemas bajo el caos del código?",
    intro:
      "Eres desarrollador en una startup fintech de Lima. Tu app tiene 50,000 usuarios activos. Hoy lunes a las 9am, justo antes del pico de transacciones, el sistema empieza a fallar. El CEO te llama. Las alertas no paran. Empieza el chaos.",
    scenes: [
      {
        id: 1,
        chapter: "Escena 1: El sistema caído",
        situation: "La app está caída. Los usuarios no pueden hacer transacciones.",
        narrative:
          "Las alertas de Sentry explotan. El dashboard de AWS muestra el servidor al 100% de CPU. Los logs muestran miles de peticiones fallidas. El CEO llama por tercera vez. En Slack, el equipo de soporte dice que los usuarios están furiosos en redes sociales. Tienes 5 minutos para decidir qué hacer primero.",
        bg: "linear-gradient(160deg, #1e1b4b 0%, #0f0a1e 60%, #1e1b4b 100%)",
        elements: [
          { emoji: "💻", size: 85, x: "40%", y: "20%", animate: "none", zIndex: 3 },
          { emoji: "🔴", size: 60, x: "65%", y: "10%", animate: "pulse", zIndex: 3 },
          { emoji: "📊", size: 70, x: "15%", y: "35%", animate: "none", zIndex: 2 },
          { emoji: "⚠️", size: 65, x: "72%", y: "40%", animate: "pulse", zIndex: 2 },
          { emoji: "📱", size: 55, x: "30%", y: "60%", animate: "float", zIndex: 2 },
          { emoji: "🔥", size: 60, x: "55%", y: "55%", animate: "pulse", zIndex: 3 },
          { emoji: "😱", size: 50, x: "5%", y: "20%", animate: "float", zIndex: 2 },
        ],
        prompt: "¿Por dónde empiezas a atacar el problema?",
        choices: [
          {
            text: "Revisas los logs de error, identificas el bottleneck y escala el servidor temporalmente",
            emoji: "🔍",
            points: 25,
            feedback: "¡Diagnóstico correcto! El problema era una query sin índice. El sistema se estabilizó en 8 minutos.",
            isGood: true,
          },
          {
            text: "Reinicias el servidor sin saber cuál es el problema",
            emoji: "🔄",
            points: 8,
            feedback: "El servidor reinició pero el problema de fondo seguía. Volvió a caer 15 minutos después.",
            isGood: false,
          },
          {
            text: "Llamas a todo el equipo a una reunión de emergencia para decidir juntos",
            emoji: "📞",
            points: 10,
            feedback: "Perdes 20 minutos críticos coordinando. En incidentes, uno debe actuar y los demás apoyar.",
            isGood: false,
          },
        ],
      },
      {
        id: 2,
        chapter: "Escena 2: El bug en producción",
        situation: "Encuentras el bug. Para arreglarlo hay que modificar la base de datos en vivo.",
        narrative:
          "El bug está en una query que hace un full table scan en la tabla de transacciones (8 millones de registros). Para arreglarlo correctamente necesitas agregar un índice. Pero agregar un índice en producción puede bloquear la tabla durante minutos en una tabla tan grande. Si falla, todo empeora.",
        bg: "linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
        elements: [
          { emoji: "🗄️", size: 80, x: "40%", y: "25%", animate: "none", zIndex: 3 },
          { emoji: "🐛", size: 70, x: "62%", y: "15%", animate: "float", zIndex: 3 },
          { emoji: "⚡", size: 65, x: "15%", y: "40%", animate: "pulse", zIndex: 2 },
          { emoji: "🔧", size: 60, x: "70%", y: "50%", animate: "float", zIndex: 2 },
          { emoji: "💾", size: 55, x: "25%", y: "60%", animate: "none", zIndex: 2 },
          { emoji: "⏱️", size: 50, x: "82%", y: "25%", animate: "spin", zIndex: 1 },
        ],
        prompt: "¿Cómo aplicas el fix sin empeorar la situación?",
        choices: [
          {
            text: "Usas CREATE INDEX CONCURRENTLY para no bloquear la tabla mientras se crea el índice",
            emoji: "🎯",
            points: 25,
            feedback: "¡Solución experta! El índice se creó sin downtime adicional. Los tiempos de respuesta cayeron de 8s a 0.3s.",
            isGood: true,
          },
          {
            text: "Aplicas el índice directamente en producción sin concurrencia, rápido y sin rodeos",
            emoji: "⚡",
            points: 5,
            feedback: "La tabla se bloqueó 4 minutos y medio. Causaste un segundo incidente más grave que el primero.",
            isGood: false,
          },
          {
            text: "Prefieres esperar la noche con menos tráfico para aplicar el fix con calma",
            emoji: "🌙",
            points: 12,
            feedback: "Técnicamente válido pero dejaste el sistema degradado 8 horas más. Los usuarios siguieron afectados.",
            isGood: false,
          },
        ],
      },
      {
        id: 3,
        chapter: "Escena 3: El feature urgente",
        situation: "El CEO pide un feature 'para ayer' que tú sabes que es peligroso.",
        narrative:
          "Resuelto el incidente, el CEO te llama: 'Necesito que para el viernes lances el sistema de préstamos automatizados. El banco socio nos presiona.' Son martes. El feature requiere al menos 3 semanas de desarrollo seguro. Si lo haces en 3 días, habrá deuda técnica masiva y posibles brechas de seguridad en datos financieros.",
        bg: "linear-gradient(160deg, #431407 0%, #7c2d12 60%, #431407 100%)",
        elements: [
          { emoji: "👔", size: 75, x: "60%", y: "20%", animate: "none", zIndex: 3 },
          { emoji: "💻", size: 80, x: "20%", y: "35%", animate: "none", zIndex: 3 },
          { emoji: "⚠️", size: 65, x: "45%", y: "50%", animate: "pulse", zIndex: 2 },
          { emoji: "🔐", size: 60, x: "75%", y: "50%", animate: "float", zIndex: 2 },
          { emoji: "📅", size: 55, x: "10%", y: "60%", animate: "none", zIndex: 1 },
          { emoji: "💰", size: 50, x: "35%", y: "20%", animate: "float", zIndex: 1 },
        ],
        prompt: "¿Qué le respondes al CEO?",
        choices: [
          {
            text: "Explicas los riesgos técnicos con datos, propones un MVP seguro en 2 semanas",
            emoji: "📊",
            points: 25,
            feedback: "El CEO valoró tu criterio técnico. El MVP se lanzó en 2 semanas sin incidentes de seguridad.",
            isGood: true,
          },
          {
            text: "Dices que sí y programas sin dormir los 3 días para cumplir",
            emoji: "😤",
            points: 5,
            feedback: "Lanzaste en tiempo pero había una vulnerabilidad SQL injection. La auditoría del banco lo detectó.",
            isGood: false,
          },
          {
            text: "Le dices simplemente que es imposible y que se olvide del viernes",
            emoji: "🚫",
            points: 10,
            feedback: "El CEO no recibió una solución alternativa. La relación se tensó. Nunca digas imposible sin proponer algo.",
            isGood: false,
          },
        ],
      },
      {
        id: 4,
        chapter: "Escena 4: El code review",
        situation: "Revisas el código de un colega junior y está muy mal escrito.",
        narrative:
          "Tu compañero Jorge, recién egresado, hizo su primer pull request importante. El código funciona, las pruebas pasan. Pero hay duplicación masiva, nombres de variables sin sentido, sin comentarios y sin manejo de errores. Si lo apruebas, la deuda técnica crece. Si lo rechazas sin más, desmotivas a Jorge.",
        bg: "linear-gradient(160deg, #1a2744 0%, #1e3a5f 60%, #0f2742 100%)",
        elements: [
          { emoji: "👨‍💻", size: 80, x: "15%", y: "30%", animate: "none", zIndex: 3 },
          { emoji: "💻", size: 85, x: "45%", y: "20%", animate: "none", zIndex: 2 },
          { emoji: "❓", size: 65, x: "68%", y: "35%", animate: "float", zIndex: 3 },
          { emoji: "📝", size: 60, x: "30%", y: "55%", animate: "none", zIndex: 2 },
          { emoji: "🤔", size: 55, x: "78%", y: "55%", animate: "float", zIndex: 2 },
          { emoji: "💡", size: 50, x: "5%", y: "55%", animate: "pulse", zIndex: 1 },
        ],
        prompt: "¿Cómo manejas el code review con Jorge?",
        choices: [
          {
            text: "Rechazas el PR con comentarios detallados, ejemplos de mejora y ofreces una sesión de pair programming",
            emoji: "🤝",
            points: 25,
            feedback: "¡Mentor del año! Jorge aprendió más en esa sesión que en 3 meses. Su siguiente PR fue casi perfecto.",
            isGood: true,
          },
          {
            text: "Apruebas el PR para no desmotivarle, total funciona y los tests pasan",
            emoji: "✅",
            points: 5,
            feedback: "6 meses después ese código era un laberinto imposible de mantener. Tuvieron que reescribirlo todo.",
            isGood: false,
          },
          {
            text: "Rechazas el PR con un solo comentario: 'Esto está mal, reescríbelo'",
            emoji: "❌",
            points: 8,
            feedback: "Jorge se desmotivó totalmente. Dos semanas después renunció. Perdiste a un talento por falta de feedback constructivo.",
            isGood: false,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // PSICOLOGÍA
  // ─────────────────────────────────────────
  {
    id: "psicologia",
    title: "Psicología",
    emoji: "🧠",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
    tagline: "¿Puedes entender la mente humana cuando más lo necesita?",
    intro:
      "Eres psicólogo clínico en tu propio consultorio. Llevas 2 años de práctica. Hoy tienes una agenda intensa: un adolescente con depresión, una pareja en crisis y una ejecutiva con burnout. Cada uno necesita todo tu enfoque. Empieza el día.",
    scenes: [
      {
        id: 1,
        chapter: "Escena 1: El adolescente",
        situation: "Tu paciente de 16 años llega más callado que nunca y te preocupa.",
        narrative:
          "Mateo lleva 3 meses en terapia por depresión. Hoy entró sin saludar, no levantó la vista, tiene ojeras profundas. Cuando le preguntas cómo estuvo la semana, solo dice 'igual'. Pero en su mochila ves un dibujo donde hay oscuridad y una sola figura. Algo no está bien.",
        bg: "linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #1e1b4b 100%)",
        elements: [
          { emoji: "🛋️", size: 90, x: "40%", y: "35%", animate: "none", zIndex: 2 },
          { emoji: "😶", size: 70, x: "60%", y: "20%", animate: "none", zIndex: 3 },
          { emoji: "🧠", size: 65, x: "15%", y: "25%", animate: "float", zIndex: 2 },
          { emoji: "🌧️", size: 60, x: "75%", y: "50%", animate: "float", zIndex: 1 },
          { emoji: "📓", size: 50, x: "25%", y: "60%", animate: "none", zIndex: 2 },
          { emoji: "💜", size: 45, x: "5%", y: "50%", animate: "pulse", zIndex: 1 },
        ],
        prompt: "¿Cómo abordas la sesión con Mateo?",
        choices: [
          {
            text: "Le preguntas directamente si ha tenido pensamientos de hacerse daño, con calma y sin alarmar",
            emoji: "💬",
            points: 25,
            feedback: "Pregunta directa = prevención. Mateo reveló que sí había pensado en ello. Pudiste actuar a tiempo con protocolo de crisis.",
            isGood: true,
          },
          {
            text: "No preguntas sobre ideación para no 'sugerirle la idea' y sigues con la sesión normal",
            emoji: "🙈",
            points: 3,
            feedback: "El mito de 'sugerir la idea' es falso. No preguntar dejó a Mateo sin la intervención que necesitaba.",
            isGood: false,
          },
          {
            text: "Llamas a sus padres al instante sin hablar primero con él",
            emoji: "📞",
            points: 10,
            feedback: "Romper la confianza sin evaluación previa puso a Mateo a la defensiva. La alianza terapéutica se dañó.",
            isGood: false,
          },
        ],
      },
      {
        id: 2,
        chapter: "Escena 2: La pareja en crisis",
        situation: "La sesión de pareja se convierte en un enfrentamiento directo.",
        narrative:
          "Carlos y Valentina llevan 8 años juntos y 4 meses en terapia. Hoy Carlos llega con una acusación bombástica: 'Le revisé el teléfono y encontré mensajes con su ex.' Valentina niega. La sesión explota. Hablan al mismo tiempo, suben el tono, Carlos amenaza con irse. El consultorio se siente como un campo de batalla.",
        bg: "linear-gradient(160deg, #450a0a 0%, #7f1d1d 60%, #450a0a 100%)",
        elements: [
          { emoji: "👨", size: 70, x: "15%", y: "35%", animate: "none", zIndex: 3 },
          { emoji: "👩", size: 70, x: "65%", y: "35%", animate: "none", zIndex: 3 },
          { emoji: "⚡", size: 65, x: "40%", y: "25%", animate: "pulse", zIndex: 2 },
          { emoji: "💔", size: 60, x: "40%", y: "50%", animate: "float", zIndex: 3 },
          { emoji: "🧠", size: 55, x: "80%", y: "15%", animate: "none", zIndex: 2 },
          { emoji: "🌿", size: 45, x: "5%", y: "60%", animate: "float", zIndex: 1 },
        ],
        prompt: "¿Cómo manejas el caos en la sesión?",
        choices: [
          {
            text: "Interviens firmemente: 'Voy a pedirles que pausen. Hablen uno a la vez. Yo voy a moderar.'",
            emoji: "✋",
            points: 25,
            feedback: "¡Contención perfecta! La estructura calmó la sesión. Pudieron hablar de verdad por primera vez en meses.",
            isGood: true,
          },
          {
            text: "Te quedas callado esperando que ellos solos se calmen",
            emoji: "🤐",
            points: 8,
            feedback: "La pelea escaló durante 20 minutos más. Carlos se fue dando un portazo. Sin contención no hay terapia.",
            isGood: false,
          },
          {
            text: "Le das la razón a Carlos porque la conducta de Valentina parece objetivamente problemática",
            emoji: "👉",
            points: 2,
            feedback: "Tomar partido destruye la neutralidad terapéutica. Ambos perdieron la confianza en ti.",
            isGood: false,
          },
        ],
      },
      {
        id: 3,
        chapter: "Escena 3: El burnout",
        situation: "La ejecutiva llora por primera vez en sesión y revela algo inesperado.",
        narrative:
          "Daniela, 38 años, directora de una empresa con 200 empleados. Siempre llega impecable, respuestas controladas, lenguaje corporativo. Hoy, en medio de la sesión, sus ojos se llenan de lágrimas. Y dice: 'No quiero seguir. Ya no sé si me refiero al trabajo o a... todo.' La frase queda suspendida en el aire.",
        bg: "linear-gradient(160deg, #0c4a6e 0%, #075985 60%, #0c4a6e 100%)",
        elements: [
          { emoji: "💼", size: 75, x: "65%", y: "20%", animate: "none", zIndex: 2 },
          { emoji: "😢", size: 80, x: "35%", y: "30%", animate: "none", zIndex: 3 },
          { emoji: "🧠", size: 60, x: "10%", y: "40%", animate: "float", zIndex: 2 },
          { emoji: "💧", size: 50, x: "55%", y: "55%", animate: "float", zIndex: 2 },
          { emoji: "🌱", size: 55, x: "80%", y: "50%", animate: "float", zIndex: 1 },
          { emoji: "❤️", size: 45, x: "20%", y: "60%", animate: "pulse", zIndex: 1 },
        ],
        prompt: "¿Cómo respondes a 'no quiero seguir'?",
        choices: [
          {
            text: "Haces silencio un momento y preguntas con suavidad: '¿A qué te refieres con todo?'",
            emoji: "💬",
            points: 25,
            feedback: "La pregunta abrió la puerta. Daniela habló por primera vez sobre un vacío existencial profundo. La sesión fue transformadora.",
            isGood: true,
          },
          {
            text: "Immediately la tranquilizas: 'Eso es solo el estrés, ya pasará'",
            emoji: "🙏",
            points: 5,
            feedback: "Minimizar el dolor cierra la puerta. Daniela volvió a su máscara y la sesión perdió profundidad.",
            isGood: false,
          },
          {
            text: "Le preguntas directamente si tiene pensamientos de suicidio",
            emoji: "🚨",
            points: 15,
            feedback: "Importante evaluar, pero la pregunta directa sin contexto sobresaltó a Daniela que no llegaba a eso. Primero explorar.",
            isGood: false,
          },
        ],
      },
      {
        id: 4,
        chapter: "Escena 4: El límite ético",
        situation: "Un paciente te pide ser amigo en redes sociales.",
        narrative:
          "Andrés lleva un año en terapia por ansiedad social. Ha progresado enormemente. Al final de la sesión de hoy saca el teléfono y te dice: 'Sé que es raro, pero quisiera seguirte en Instagram. Me motiva ver cómo eres fuera del consultorio.' Te mira con genuina admiración y gratitud.",
        bg: "linear-gradient(160deg, #065f46 0%, #047857 60%, #064e3b 100%)",
        elements: [
          { emoji: "📱", size: 75, x: "50%", y: "25%", animate: "none", zIndex: 3 },
          { emoji: "🧠", size: 70, x: "15%", y: "35%", animate: "none", zIndex: 2 },
          { emoji: "🤝", size: 65, x: "68%", y: "45%", animate: "none", zIndex: 2 },
          { emoji: "⚖️", size: 60, x: "30%", y: "55%", animate: "float", zIndex: 2 },
          { emoji: "🔒", size: 55, x: "80%", y: "20%", animate: "none", zIndex: 1 },
          { emoji: "💚", size: 45, x: "5%", y: "60%", animate: "pulse", zIndex: 1 },
        ],
        prompt: "¿Qué le respondes a Andrés?",
        choices: [
          {
            text: "Declinas amablemente, explicas el encuadre terapéutico y lo conviertes en aprendizaje sobre límites",
            emoji: "🌱",
            points: 25,
            feedback: "¡Respuesta ética y terapéutica! Andrés entendió los límites y lo usaron para trabajar sus propias dificultades con límites relacionales.",
            isGood: true,
          },
          {
            text: "Aceptas porque la relación terapéutica va bien y no ves el daño",
            emoji: "✅",
            points: 0,
            feedback: "Las redes sociales violan el encuadre terapéutico. La mezcla de roles comprometió la terapia y tuviste que derivarlo a otro colega.",
            isGood: false,
          },
          {
            text: "Le dices que tienes redes privadas y le cambias el tema rápido",
            emoji: "🙈",
            points: 10,
            feedback: "Evadir la situación perdió una oportunidad terapéutica valiosa. El tema de límites en Andrés quedó sin trabajar.",
            isGood: false,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // MARKETING
  // ─────────────────────────────────────────
  {
    id: "marketing",
    title: "Marketing & Comunicación",
    emoji: "📣",
    color: "#ea580c",
    gradient: "linear-gradient(135deg, #ea580c, #f97316)",
    tagline: "¿Puedes crear campañas que muevan corazones y ventas?",
    intro:
      "Eres Brand Manager en una marca peruana de snacks que quiere competir contra Lay's. Presupuesto: S/. 200,000 para la campaña de lanzamiento. Tres semanas para crear, producir y lanzar. Y el CEO acaba de decirte: 'Quiero viral o no salimos.'",
    scenes: [
      {
        id: 1,
        chapter: "Escena 1: La estrategia",
        situation: "El equipo propone dos estrategias totalmente opuestas.",
        narrative:
          "En la reunión de kick-off, tu equipo está dividido: Laura propone una campaña emocional con familias peruanas en momentos auténticos (bajo costo, alto impacto potencial). Marco propone contratar al influencer más grande del país para un unboxing (S/. 80,000 del presupuesto en uno solo). Tú tienes que decidir.",
        bg: "linear-gradient(160deg, #431407 0%, #7c2d12 60%, #431407 100%)",
        elements: [
          { emoji: "📊", size: 80, x: "40%", y: "20%", animate: "none", zIndex: 3 },
          { emoji: "👥", size: 75, x: "15%", y: "40%", animate: "none", zIndex: 2 },
          { emoji: "📱", size: 65, x: "68%", y: "35%", animate: "float", zIndex: 2 },
          { emoji: "💡", size: 70, x: "58%", y: "15%", animate: "pulse", zIndex: 3 },
          { emoji: "🎯", size: 60, x: "25%", y: "60%", animate: "float", zIndex: 2 },
          { emoji: "💰", size: 55, x: "80%", y: "55%", animate: "none", zIndex: 1 },
        ],
        prompt: "¿Cuál estrategia eliges o propones?",
        choices: [
          {
            text: "Combinación: 40% al influencer + 60% a micro-influencers y contenido auténtico UGC",
            emoji: "⚖️",
            points: 25,
            feedback: "¡Estrategia inteligente! El influencer dio alcance masivo y el UGC generó credibilidad. La campaña fue viral orgánica.",
            isGood: true,
          },
          {
            text: "Todo al influencer grande, el reach justifica el gasto",
            emoji: "⭐",
            points: 10,
            feedback: "El influencer publicó y ya. Sin conversación ni UGC, la campaña fue un flash sin resonancia duradera.",
            isGood: false,
          },
          {
            text: "Solo contenido emocional orgánico, sin pagar influencers",
            emoji: "❤️",
            points: 15,
            feedback: "La autenticidad fue poderosa pero el alcance inicial fue limitado. Les costó 2 semanas más llegar al objetivo.",
            isGood: false,
          },
        ],
      },
      {
        id: 2,
        chapter: "Escena 2: La crisis",
        situation: "Un tweet viral acusa a tu marca de algo que no es verdad.",
        narrative:
          "A los 5 días del lanzamiento, un tweet con 40,000 likes dice: '@MarcaSnack usa aceite de palma de plantaciones que destruyen la Amazonía peruana.' No es cierto — su aceite es de palma certificada RSPO. Pero la acusación se está viralizando y los periodistas ya llaman. Tienes 1 hora para responder.",
        bg: "linear-gradient(160deg, #1e1b4b 0%, #3730a3 60%, #1e1b4b 100%)",
        elements: [
          { emoji: "🔴", size: 75, x: "50%", y: "10%", animate: "pulse", zIndex: 3 },
          { emoji: "📱", size: 80, x: "35%", y: "25%", animate: "none", zIndex: 3 },
          { emoji: "🌿", size: 65, x: "65%", y: "40%", animate: "float", zIndex: 2 },
          { emoji: "😰", size: 60, x: "10%", y: "40%", animate: "float", zIndex: 2 },
          { emoji: "🔥", size: 70, x: "70%", y: "20%", animate: "pulse", zIndex: 3 },
          { emoji: "📢", size: 55, x: "20%", y: "60%", animate: "float", zIndex: 1 },
        ],
        prompt: "¿Cómo manejas la crisis en redes?",
        choices: [
          {
            text: "Publicas en menos de 1 hora: foto del certificado RSPO + video corto del proceso de aceite",
            emoji: "⚡",
            points: 25,
            feedback: "¡Respuesta correcta! Rapidez + evidencia. La marca salió fortalecida. El propio tuitero pidió disculpas.",
            isGood: true,
          },
          {
            text: "Ignoras el tweet esperando que la polémica se apague sola",
            emoji: "🙈",
            points: 3,
            feedback: "El silencio se interpretó como culpa. Cuatro medios digitales publicaron la acusación al día siguiente.",
            isGood: false,
          },
          {
            text: "Contactas al tuitero en privado para pedirle que borre el tweet",
            emoji: "🤫",
            points: 8,
            feedback: "El tuitero filtró la conversación privada y se viralizó peor. La audiencia interpretó la maniobra como presión corporativa.",
            isGood: false,
          },
        ],
      },
      {
        id: 3,
        chapter: "Escena 3: Los datos",
        situation: "Las métricas muestran algo que contradice la narrativa del CEO.",
        narrative:
          "El CEO está feliz porque el post del influencer tuvo 2 millones de impresiones. Pero tú revisas el dashboard de ventas: conversión 0.02%. Las impresiones fueron vacías. El contenido UGC de usuarios reales (50,000 views) tiene 3.4% de conversión. El CEO quiere doblar la inversión en el influencer para la siguiente fase.",
        bg: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)",
        elements: [
          { emoji: "📊", size: 85, x: "40%", y: "15%", animate: "none", zIndex: 3 },
          { emoji: "📈", size: 70, x: "65%", y: "35%", animate: "none", zIndex: 2 },
          { emoji: "📉", size: 70, x: "15%", y: "35%", animate: "none", zIndex: 2 },
          { emoji: "🤔", size: 65, x: "50%", y: "55%", animate: "float", zIndex: 3 },
          { emoji: "💡", size: 55, x: "80%", y: "55%", animate: "pulse", zIndex: 1 },
          { emoji: "👔", size: 60, x: "5%", y: "55%", animate: "none", zIndex: 2 },
        ],
        prompt: "¿Le presentas la realidad al CEO?",
        choices: [
          {
            text: "Presentas los datos reales con un dashboard claro y propones redirigir el presupuesto al UGC",
            emoji: "📋",
            points: 25,
            feedback: "El CEO confió en tus datos. El UGC escalado generó 5x más ventas que el influencer. Tú eres el héroe de la campaña.",
            isGood: true,
          },
          {
            text: "Le dices que sí al CEO para no contradecirle, total las impresiones se ven bien en el reporte",
            emoji: "😬",
            points: 5,
            feedback: "El presupuesto se despilfarró. Cuando los resultados de ventas llegaron, el CEO preguntó por qué nadie dijo nada.",
            isGood: false,
          },
          {
            text: "Esperas a tener más semanas de datos antes de confrontar al CEO",
            emoji: "⏳",
            points: 12,
            feedback: "Para entonces ya habían gastado S/. 40,000 más en el influencer. Los datos llegaron tarde.",
            isGood: false,
          },
        ],
      },
      {
        id: 4,
        chapter: "Escena 4: El pitch final",
        situation: "Presentas los resultados de la campaña ante el directorio.",
        narrative:
          "Fin de la campaña. Presentas ante 8 directivos. La marca subió 23% en ventas vs el trimestre anterior. Reconocimiento de marca subió 31%. Pero el costo por adquisición fue S/. 4 más caro que el objetivo. Uno de los directivos señala ese número y pregunta: '¿Por qué no lograron el CPA objetivo?'",
        bg: "linear-gradient(160deg, #064e3b 0%, #065f46 60%, #022c22 100%)",
        elements: [
          { emoji: "📊", size: 85, x: "40%", y: "15%", animate: "none", zIndex: 2 },
          { emoji: "👔", size: 75, x: "70%", y: "35%", animate: "none", zIndex: 3 },
          { emoji: "🎯", size: 70, x: "15%", y: "35%", animate: "none", zIndex: 2 },
          { emoji: "💹", size: 65, x: "55%", y: "55%", animate: "none", zIndex: 2 },
          { emoji: "🌟", size: 55, x: "80%", y: "55%", animate: "pulse", zIndex: 1 },
          { emoji: "🗣️", size: 60, x: "25%", y: "60%", animate: "float", zIndex: 3 },
        ],
        prompt: "¿Cómo respondes sobre el CPA?",
        choices: [
          {
            text: "Explicas que el CPA alto fue por el aprendizaje de la campaña de lanzamiento y presentas el plan optimizado",
            emoji: "📈",
            points: 25,
            feedback: "¡Respuesta madura! El directorio valoró la transparencia y la visión a futuro. Aprobaron el presupuesto para Q2.",
            isGood: true,
          },
          {
            text: "Echas la culpa al equipo de ventas por no convertir el tráfico que generaste",
            emoji: "👉",
            points: 3,
            feedback: "Nunca culpes a otro equipo en una presentación de directorio. Quedaste como alguien que no asume responsabilidad.",
            isGood: false,
          },
          {
            text: "Minimizas el dato del CPA y enfatizas solo los logros",
            emoji: "🙈",
            points: 10,
            feedback: "El directorio notó la evasión. 'Si evita los números difíciles, ¿cuánto más nos oculta?' — preguntó un director.",
            isGood: false,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // ARQUITECTURA
  // ─────────────────────────────────────────
  {
    id: "arquitectura",
    title: "Arquitectura",
    emoji: "🏛️",
    color: "#be185d",
    gradient: "linear-gradient(135deg, #be185d, #db2777)",
    tagline: "¿Tienes el ojo y el criterio para crear espacios que perduran?",
    intro:
      "Ganas el concurso de arquitectura más importante del año: diseñar la nueva Biblioteca Central de San Isidro. Presupuesto: S/. 12 millones. El alcalde quiere algo 'icónico y moderno'. El vecindario quiere 'que no rompa el paisaje'. Y tú tienes que satisfacer a todos.",
    scenes: [
      {
        id: 1,
        chapter: "Escena 1: El concepto",
        situation: "Tienes que presentar el concepto al municipio en 48 horas.",
        narrative:
          "Estás en tu estudio a las 11pm con tu equipo. La pantalla muestra tres bocetos: uno ultra moderno de vidrio y acero que impresiona pero choca con el vecindario histórico, uno conservador que encaja pero no tiene nada especial, y uno intermedio orgánico con jardines en las fachadas que es arriesgado pero puede ser extraordinario.",
        bg: "linear-gradient(160deg, #2d1b69 0%, #4c1d95 60%, #2d1b69 100%)",
        elements: [
          { emoji: "🏛️", size: 85, x: "40%", y: "20%", animate: "none", zIndex: 3 },
          { emoji: "✏️", size: 70, x: "15%", y: "35%", animate: "float", zIndex: 2 },
          { emoji: "🌿", size: 65, x: "65%", y: "30%", animate: "float", zIndex: 2 },
          { emoji: "💡", size: 75, x: "55%", y: "10%", animate: "pulse", zIndex: 3 },
          { emoji: "📐", size: 60, x: "25%", y: "60%", animate: "none", zIndex: 2 },
          { emoji: "🌙", size: 50, x: "82%", y: "15%", animate: "none", zIndex: 1 },
          { emoji: "☕", size: 40, x: "5%", y: "60%", animate: "none", zIndex: 1 },
        ],
        prompt: "¿Qué concepto presentas al municipio?",
        choices: [
          {
            text: "El diseño orgánico con jardines verticales: innovador, verde y en diálogo con el entorno",
            emoji: "🌿",
            points: 25,
            feedback: "¡Visión brillante! El alcalde dijo 'esto es exactamente lo que Lima necesita'. El proyecto ganó el Bienal de Arquitectura.",
            isGood: true,
          },
          {
            text: "El diseño ultra moderno — quieres hacer historia y el municipio pagó por 'icónico'",
            emoji: "🏙️",
            points: 12,
            feedback: "El municipio lo aprobó pero los vecinos protestaron meses. La obra tuvo conflictos constantes.",
            isGood: false,
          },
          {
            text: "El diseño conservador — menos riesgo y cumple con las expectativas del vecindario",
            emoji: "🏠",
            points: 8,
            feedback: "Fue aprobado sin problemas pero 5 años después nadie recordaba al arquitecto. Era solo un edificio más.",
            isGood: false,
          },
        ],
      },
      {
        id: 2,
        chapter: "Escena 2: El cliente difícil",
        situation: "El alcalde quiere cambiar el diseño aprobado a mitad del proyecto.",
        narrative:
          "Llevan 4 meses de obra. El alcalde llama: 'Vi una biblioteca en Dubai con una cúpula dorada. Quiero esa cúpula en nuestra biblioteca.' El problema: la estructura ya está calculada, no soporta una cúpula. Agregarla costaría S/. 800,000 extras no presupuestados y cambiaría completamente la esencia del diseño.",
        bg: "linear-gradient(160deg, #1c1917 0%, #44403c 60%, #1c1917 100%)",
        elements: [
          { emoji: "🏗️", size: 90, x: "40%", y: "10%", animate: "none", zIndex: 2 },
          { emoji: "👔", size: 75, x: "65%", y: "35%", animate: "none", zIndex: 3 },
          { emoji: "🏛️", size: 70, x: "15%", y: "40%", animate: "none", zIndex: 3 },
          { emoji: "💰", size: 65, x: "75%", y: "55%", animate: "float", zIndex: 2 },
          { emoji: "😤", size: 60, x: "30%", y: "60%", animate: "pulse", zIndex: 2 },
          { emoji: "📐", size: 50, x: "5%", y: "25%", animate: "float", zIndex: 1 },
        ],
        prompt: "¿Cómo respondes al alcalde?",
        choices: [
          {
            text: "Presentas un informe técnico del impacto y propones un elemento alternativo que logre el mismo efecto visual",
            emoji: "📊",
            points: 25,
            feedback: "Propusiste una linterna de luz dorada en la cima que evocaba la cúpula sin afectar la estructura. El alcalde lo amó.",
            isGood: true,
          },
          {
            text: "Dices que sí, figuras cómo ajustar la estructura y lo añades al presupuesto",
            emoji: "✅",
            points: 10,
            feedback: "La cúpula se construyó pero el refuerzo estructural costó S/. 1.2M, no 800k. El proyecto terminó con sobrecosto.",
            isGood: false,
          },
          {
            text: "Te niegas rotundamente: 'El diseño aprobado no se toca'",
            emoji: "🚫",
            points: 8,
            feedback: "El alcalde llamó al gerente de tu firma. La negativa sin alternativas comprometió la relación con el cliente.",
            isGood: false,
          },
        ],
      },
      {
        id: 3,
        chapter: "Escena 3: El acceso universal",
        situation: "El diseño tiene una falla de accesibilidad que nadie notó.",
        narrative:
          "Una representante de la Asociación de Personas con Discapacidad visita la obra en construcción. Señala que las rampas de acceso al segundo piso tienen 14% de pendiente cuando el máximo reglamentario es 8%. Y que el ascensor proyectado no llega al sótano donde estará el archivo histórico. Para una biblioteca pública, esto es un problema grave.",
        bg: "linear-gradient(160deg, #0c4a6e 0%, #075985 60%, #0c4a6e 100%)",
        elements: [
          { emoji: "♿", size: 75, x: "35%", y: "35%", animate: "none", zIndex: 3 },
          { emoji: "🏛️", size: 85, x: "50%", y: "10%", animate: "none", zIndex: 2 },
          { emoji: "⚠️", size: 70, x: "65%", y: "40%", animate: "pulse", zIndex: 3 },
          { emoji: "🔧", size: 60, x: "15%", y: "50%", animate: "float", zIndex: 2 },
          { emoji: "📏", size: 55, x: "78%", y: "55%", animate: "float", zIndex: 2 },
          { emoji: "🌟", size: 45, x: "5%", y: "25%", animate: "pulse", zIndex: 1 },
        ],
        prompt: "¿Cómo abordas las fallas de accesibilidad?",
        choices: [
          {
            text: "Paralizas esa zona, rediseñas con el calculista y asumes el costo adicional — es lo correcto",
            emoji: "✅",
            points: 25,
            feedback: "La representante publicó un artículo elogiando tu responsabilidad. La biblioteca fue premiada por accesibilidad inclusiva.",
            isGood: true,
          },
          {
            text: "Explicas que los planos fueron aprobados por el municipio, que no es tu responsabilidad",
            emoji: "🙅",
            points: 3,
            feedback: "Legalmente cuestionable y moralmente inaceptable. La nota de prensa negativa llegó antes que la inauguración.",
            isGood: false,
          },
          {
            text: "Corriges solo la rampa visible y dejas el sótano para después de la inauguración",
            emoji: "⏳",
            points: 10,
            feedback: "El sótano quedó inaccesible. En la inauguración lo notaron y el alcalde quedó en evidencia.",
            isGood: false,
          },
        ],
      },
      {
        id: 4,
        chapter: "Escena 4: La inauguración",
        situation: "El día de la inauguración, la prensa te hace la pregunta más difícil.",
        narrative:
          "Es el gran día. La biblioteca está impresionante. Cientos de personas, el alcalde, cámaras de televisión. Después del discurso, un periodista de investigación se acerca con un micrófono: 'Se dice que el arquitecto original del terreno presentó una demanda por plagio de concepto. ¿Tiene comentario?'",
        bg: "linear-gradient(160deg, #064e3b 0%, #065f46 60%, #022c22 100%)",
        elements: [
          { emoji: "🏛️", size: 95, x: "40%", y: "5%", animate: "none", zIndex: 1 },
          { emoji: "🎤", size: 75, x: "60%", y: "35%", animate: "none", zIndex: 3 },
          { emoji: "📷", size: 65, x: "15%", y: "40%", animate: "float", zIndex: 2 },
          { emoji: "😰", size: 60, x: "40%", y: "45%", animate: "pulse", zIndex: 3 },
          { emoji: "🌟", size: 55, x: "80%", y: "20%", animate: "pulse", zIndex: 1 },
          { emoji: "🎊", size: 50, x: "5%", y: "20%", animate: "float", zIndex: 1 },
        ],
        prompt: "¿Qué le respondes al periodista?",
        choices: [
          {
            text: "Con calma: 'Toda creación tiene influencias. Nuestro proceso es auténtico y estamos dispuestos a demostrarlo'",
            emoji: "😌",
            points: 25,
            feedback: "Respuesta serena y transparente. La demanda fue desestimada meses después. Tu actitud pública fue elogiada.",
            isGood: true,
          },
          {
            text: "Dices 'Sin comentarios' y te alejas del periodista",
            emoji: "🚶",
            points: 8,
            feedback: "El 'sin comentarios' en televisión pareció una admisión. Las redes lo amplificaron negativamente.",
            isGood: false,
          },
          {
            text: "Te ofendes y acusas al otro arquitecto de envidia en cámara",
            emoji: "😤",
            points: 0,
            feedback: "La reacción emocional fue viral en el peor sentido. El proyecto quedó opacado por la controversia.",
            isGood: false,
          },
        ],
      },
    ],
  },
];
