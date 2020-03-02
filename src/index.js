const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

let x = canvas.width / 2
let y = canvas.height - 30

let dx = 2
let dy = -2
const ballRadius = 10

const paddleHeight = 10
const paddleWidth = 75
let paddleX = (canvas.width - paddleWidth) / 2

let rightPressed = false
let leftPressed = false

const brickRowCount = 3
const brickColumnCount = 5
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 30

let lives = 2

const bricks = [...Array(brickColumnCount).keys()].map(
  (columnIndex) => [...Array(brickRowCount).keys()].map(
    (rowIndex) => ({
      x: columnIndex * (brickWidth + brickPadding) + brickOffsetLeft,
      y: rowIndex * (brickHeight + brickPadding) + brickOffsetTop,
      status: 1,
    }),
  ),
)

let score = 0

const collisionDetection = () =>
  bricks.forEach((column) => column.forEach((brick) => {
    if (
      brick.status === 1 &&
      x >= brick.x &&
      x <= (brick.x + brickWidth) &&
      y >= brick.y &&
      y <= (brick.y + brickHeight)
    ) {
      brick.status = 0
      score++
      if (score >= (brickRowCount * brickColumnCount)) {
        alert('YOU WIN!!!')
        document.location.reload()
      } else {
        dy *= -1
      }
    }
  }))

const drawBall = () => {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

const drawPaddle = () => {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

const drawBricks = () => bricks.forEach((column) => column.forEach((brick) => {
  if (brick.status === 0) {
    return
  }
  ctx.beginPath()
  ctx.rect(brick.x, brick.y, brickWidth, brickHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}))

const drawScore = () => {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText(`Score: ${score}`, 8, 20)
}

const drawLives = () => {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20)
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall()
  drawPaddle()
  collisionDetection()
  drawBricks()
  drawScore()
  drawLives()

  if (x + ballRadius > canvas.width || x - ballRadius < 0) {
    dx *= -1
  }
  if (y - ballRadius < 0) {
    dy *= -1
  } else if (y + ballRadius > (canvas.height - paddleHeight)) {
    if (x > paddleX && x < (paddleX + paddleWidth)) {
      dy = -Math.abs(dy)
    } else if (y + ballRadius > canvas.height) {
      if (lives === 0) {
        console.error('GAME OVER')
        return
        // document.location.reload()
      } else {
        lives--
        x = canvas.width / 2
        y = canvas.height - 30
        dx = 2
        dy = -2
        paddleX = (canvas.width - paddleWidth) / 2
      }
    }
  }

  if (rightPressed && !leftPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth)
  }
  if (leftPressed && !rightPressed) {
    paddleX = Math.max(paddleX - 7, 0)
  }

  x += dx
  y += dy
  requestAnimationFrame(draw)
}

const keyDownHandler = ({ key }) => {
  rightPressed = rightPressed || ['Right', 'ArrowRight'].includes(key)
  leftPressed = leftPressed || ['Left', 'ArrowLeft'].includes(key)
}

const keyUpHandler = ({ key }) => {
  rightPressed = rightPressed && !['Right', 'ArrowRight'].includes(key)
  leftPressed = leftPressed && !['Left', 'ArrowLeft'].includes(key)
}

const mouseMoveHandler = ({ clientX }) => {
  const relativeX = clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2
  }
}

document.addEventListener('keydown', keyDownHandler)
document.addEventListener('keyup', keyUpHandler)
document.addEventListener('mousemove', mouseMoveHandler)

draw()
