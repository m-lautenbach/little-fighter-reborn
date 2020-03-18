const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const state = {
  ball: {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 2,
    dy: -2,
    radius: 10,
  },
  paddle: {
    height: 10,
    width: 75,
    x: (canvas.width - 75) / 2,
    dx: 7,
  },
  input: {
    leftPressed: false,
    rightPressed: false,
  },
  player: {
    lives: 2,
    score: 0,
    lost: false,
  },
  bricks: [...Array(5).keys()].flatMap(
    (columnIndex) => [...Array(3).keys()].map(
      (rowIndex) => ({
        x: columnIndex * (75 + 10) + 30,
        y: rowIndex * (20 + 10) + 30,
        width: 75,
        height: 20,
        status: 1,
      }),
    ),
  ),
}

const drawBall = () => {
  const { ball: { x, y, radius } } = state
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

const drawPaddle = () => {
  const { paddle: { x, width, height } } = state
  ctx.beginPath()
  ctx.rect(x, canvas.height - height, width, height)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

const drawBricks = () => {
  const { bricks } = state
  bricks.forEach(({ status, x, y, width, height }) => {
    if (status === 0) {
      return
    }
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.fillStyle = '#0095DD'
    ctx.fill()
    ctx.closePath()
  })
}

const drawScore = () => {
  const { player: { score } } = state
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText(`Score: ${score}`, 8, 20)
}

const drawLives = () => {
  const { player: { lives } } = state
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20)
}

const brickCollision = () => {
  const { ball, bricks, player } = state
  bricks.forEach((brick) => {
    const { x, y, width, height, status } = brick
    if (
      status === 1 &&
      (ball.x + ball.radius) >= x &&
      (ball.x - ball.radius) <= (x + width) &&
      (ball.y + ball.radius) >= y &&
      (ball.y - ball.radius) <= (y + height)
    ) {
      brick.status = 0
      player.score++
      if (player.score >= bricks.length) {
        alert('YOU WIN!!!')
        document.location.reload()
      } else {
        ball.dy *= -1
      }
    }
  })
}

const paddleCollision = () => {
  const { ball, paddle } = state
  if (ball.y + ball.radius > (canvas.height - paddle.height) &&
    ball.x > paddle.x && ball.x < (paddle.x + paddle.width)
  ) {
    ball.dy = -Math.abs(ball.dy)
  }
}

const wallCollision = () => {
  const { ball, paddle, player } = state
  const { x, y, radius } = ball
  if (x + radius > canvas.width || x - radius < 0) {
    ball.dx *= -1
  }
  if (y - radius < 0) {
    ball.dy *= -1
  }
  if (y + radius > canvas.height) {
    if (player.lives === 0) {
      state.player.lost = true
      return
    }
    player.lives--
    ball.x = canvas.width / 2
    ball.y = canvas.height - 30
    ball.dx = 2
    ball.dy = -2
    paddle.x = (canvas.width - paddle.width) / 2
  }
}

const movePaddle = () => {
  const { paddle, input: { leftPressed, rightPressed } } = state
  const { x, dx, width } = paddle
  if (rightPressed && !leftPressed) {
    paddle.x = Math.min(x + dx, canvas.width - width)
  }
  if (leftPressed && !rightPressed) {
    paddle.x = Math.max(x - dx, 0)
  }
}

const moveBall = () => {
  const { ball } = state
  const { dx, dy } = ball
  ball.x += dx
  ball.y += dy
}

const draw = () => {
  if (state.player.lost) {
    alert('GAME OVER')
    location.reload()
  }
  requestAnimationFrame(draw)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall()
  drawPaddle()
  brickCollision()
  paddleCollision()
  wallCollision()
  drawBricks()
  drawScore()
  drawLives()

  movePaddle()
  moveBall()
}

const keyDownHandler = ({ key }) => {
  const { input } = state
  input.rightPressed = input.rightPressed || ['Right', 'ArrowRight'].includes(key)
  input.leftPressed = input.leftPressed || ['Left', 'ArrowLeft'].includes(key)
}

const keyUpHandler = ({ key }) => {
  const { input } = state
  input.rightPressed = input.rightPressed && !['Right', 'ArrowRight'].includes(key)
  input.leftPressed = input.leftPressed && !['Left', 'ArrowLeft'].includes(key)
}

const mouseMoveHandler = ({ clientX }) => {
  const { paddle } = state
  const relativeX = clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2
  }
}

export const start = () => {
  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('keyup', keyUpHandler)
  document.addEventListener('mousemove', mouseMoveHandler)

  draw()
}
