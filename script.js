const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const participants = [ "AGUSTINA", "BRIANA", "KENYI", "ALEJANDRA", "FRANK", "WILLY", "JAIME", "LEANDRO", "SOLEDAD", "PORFIRIO" ];
const winners = ["PORFIRIO" , "FRANK","BRIANA" ];
let spinCount = 0;
let isSpinning = false;

function drawWheel() {
    const sliceAngle = (2 * Math.PI) / participants.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < participants.length; i++) {
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.closePath();
        ctx.fillStyle = `hsl(${(i * 360) / participants.length}, 100%, 50%)`;
        ctx.fill();

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(i * sliceAngle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "20px Arial";
        ctx.fillText(participants[i], 230, 10);
        ctx.restore();
    }
}

function spinWheel() {
    if (isSpinning || spinCount >= winners.length) return;
    isSpinning = true;
    spinCount++;

    const spinTime = 3000; // Duración del giro en milisegundos
    const rotations = 6; // Número de rotaciones completas antes de detenerse
    const winnerIndex = participants.indexOf(winners[spinCount - 1]);
    const sliceAngle = (2 * Math.PI) / participants.length;
    const endAngle = (2 * Math.PI * rotations) + (sliceAngle * winnerIndex) + (sliceAngle / 2);

    let startTime = null;

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinTime, 1);
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);

        const currentAngle = easeOutProgress * endAngle;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(currentAngle);
        ctx.translate(-250, -250);
        drawWheel();
        ctx.restore();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            announceWinner();
        }
    }

    requestAnimationFrame(animate);
}

function announceWinner() {
    const winnerName = winners[spinCount - 1];
    const currentDate = new Date().toLocaleDateString();
    document.getElementById('winner').textContent = `Ganador: ${winnerName} (Fecha: ${currentDate})`;
}

document.getElementById('spinButton').addEventListener('click', spinWheel);
drawWheel();
