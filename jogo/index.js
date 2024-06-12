var config = {
    type: Phaser.AUTO, // Define o tipo de renderização do jogo
    width: 800, 
    height: 600, 
    physics: { // Configurações relacionadas à física do jogo
        default: 'arcade', // Define o tipo de física padrão
        arcade: { // Configurações específicas para o motor de física Arcade
            gravity: { y: 300 }, // Define a gravidade vertical
            debug: false // Ativa ou desativa a visualização de informações de depuração
        }
    },
    scene: {
        preload: preload, // Função para pré-carregar recursos
        create: create, // Função para criar elementos do jogo
        update: update // Função para atualizar o estado do jogo
    }
};

var player; 
var stars;  
var bombs; 
var platforms;  
var cursors; 
var score = 1500;  
var gameOver = false;
var scoreText;   
var timerText;  
var timeLeft = 0; 
var game = new Phaser.Game(config); 

function preload() { // Função para pré-carregar recursos do jogo
    // Carrega as imagens utilizadas no jogo
    this.load.image('sky', 'assets/fundo.jpeg');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/javascript.jpg');
    this.load.image('bomb', 'assets/java.jpg');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() { // Função para criar elementos do jogo
    // Adiciona uma imagem de fundo
    this.add.image(400, 300, 'sky');

    // Cria um grupo de plataformas estáticas
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(1, 400, 'ground');
    platforms.create(560, 400, 'ground');
    platforms.create(450, 250, 'ground');
    platforms.create(450, 120, 'ground');

    // Adiciona o jogador ao jogo
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Cria animações para o jogador
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Cria o teclado virtual
    cursors = this.input.keyboard.createCursorKeys();

    // Cria um grupo de estrelas
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    // Define o comportamento de quicar das estrelas
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Cria um grupo de bombas
    bombs = this.physics.add.group();

    // Adiciona o texto da pontuação na tela
    scoreText = this.add.text(16, 16, 'erros no codigo : 1500', { fontSize: '32px', fill: 'white' });

    // Adiciona o texto do temporizador na tela
    timerText = this.add.text(500, 16, 'Tempo: ' + formatTime(timeLeft), { fontSize: '32px', fill: 'white' });

    // Adiciona colisões entre os objetos
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    // Adiciona a detecção de sobreposição entre o jogador e as estrelas
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // Adiciona a detecção de colisão entre o jogador e as bombas
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() { // Função para atualizar o estado do jogo
    if (score === 0) { // Verifica se a pontuação chegou a zero
        gameOver = true; // Define o estado do jogo como encerrado
        alert("você venceu o java você é brabo"); // Exibe uma mensagem de vitória
    }
    if (gameOver) { // Verifica se o jogo está encerrado
        return; 
    }

    if (cursors.left.isDown) { // Verifica se a tecla de seta para a esquerda está pressionada
        player.setVelocityX(-160); // Define a velocidade do jogador para a esquerda
        player.anims.play('left', true); // Inicia a animação de movimento para a esquerda
    } else if (cursors.right.isDown) { // Verifica se a tecla de seta para a direita está pressionada
        player.setVelocityX(160); // Define a velocidade do jogador para a direita
        player.anims.play('right', true); // Inicia a animação de movimento para a direita
    } else { // Se nenhuma tecla de movimento horizontal estiver pressionada
        player.setVelocityX(0); // Define a velocidade do jogador como zero
        player.anims.play('turn'); // Inicia a animação de parado
    }

    if (cursors.up.isDown && player.body.touching.down) { // Verifica se a tecla de seta para cima está pressionada e o jogador está tocando o chão
        player.setVelocityY(-330); // Aplica uma força para fazer o jogador pular
    }

    // Atualiza o tempo restante
    timeLeft++;
    updateTimeText();
}

function collectStar(player, star) { // Função chamada quando o jogador coleta uma estrela
    star.disableBody(true, true); // Desativa e oculta a estrela
    score -= 10; // Diminui a pontuação
    scoreText.setText('erros no codigo : ' + score); // Atualiza o texto da pontuação

    if (stars.countActive(true) === 0) { // Verifica se não há mais estrelas ativas no jogo
        // Respawn das estrelas
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        // Cria uma nova bomba em uma posição aleatória
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function hitBomb(player, bomb) { // Função chamada quando o jogador colide com uma bomba
    this.physics.pause(); // Pausa a física do jogo
    player.setTint(0xff0000); // Tinge o jogador de vermelho
    player.anims.play('turn'); // Inicia a animação de parado
    gameOver = true; // Define o estado do jogo como encerrado
}

function updateTimeText() { // Função para atualizar o texto do temporizador
    timerText.setText('Tempo: ' + formatTime(timeLeft)); // Atualiza o texto com o tempo formatado
}

function formatTime(seconds) { // Função para formatar o tempo em minutos e segundos
    var minutes = Math.floor(seconds / 60); // Calcula os minutos
    var remainingSeconds = seconds % 60; // Calcula os segundos restantes

    if (remainingSeconds < 10) { // Adiciona um zero à esquerda se os segundos forem menores que 10
        remainingSeconds = '0' + remainingSeconds;
    }

    return minutes + ':' + remainingSeconds; // Retorna o tempo formatado como uma string
}
