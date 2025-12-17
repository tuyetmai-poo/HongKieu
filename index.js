const correctPass = "181206";
const passwordField = document.getElementById("password");
let hieuUngDangChay = null;

// Animation control
let animationFrameMatrix = null;
let animationFrameParticles = null;

// ------------------ BUTTON EVENT ------------------
document.querySelectorAll(".buttons button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const v = btn.textContent;
    if (v === "✔") chuyenTrang();
    else if (v === "✖") passwordField.value = "";
    else if (passwordField.value.length < 6) passwordField.value += v;
  });
});

function startBackgroundMusic() {
  const music = document.getElementById("backgroundMusic");
  music.volume = 0.5; // âm lượng 50%
  music.play().catch((err) => {
    console.log("Autoplay bị chặn, cần người dùng click:", err);
  });
}

// ------------------ PAGE SWITCH ------------------
function chuyenTrang() {
  if (passwordField.value !== correctPass) {
    alert("Nhập lại nào người đẹp 🫶");
    passwordField.value = "";
    return;
  }

  document.getElementById("trang1").style.display = "none";
  document.getElementById("trang2").style.display = "block";
  startBackgroundMusic();
  const canvas = document.getElementById("particleCanvas");
  canvas.style.display = "block";
  startCanvasEffect();
}

// ------------------ CANVAS + TEXT EFFECT ------------------
function startCanvasEffect() {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // MATRIX
  const chars = "CHUC EM SINH NHAT VUI VE HỒNG KIỀU ";
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize) * 1.5;
  const drops = Array(Math.floor(columns)).fill(1);

  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff4757";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
        drops[i] = 0;
      drops[i] += Math.random() * 1.5 + 0.5;
    }
    animationFrameMatrix = requestAnimationFrame(drawMatrix);
  }

  drawMatrix();

  // PARTICLE TEXT EFFECT
  const texts = ["3", "2", "1", "HAPPY BIRTHDAY ❤️🎁", "18.12.2006", "18.12.2025", "NGUYỄN THỊ HỒNG KIỀU"];
  let currentText = 0;
  let particles = [];
  let mode = "fall";

  function createTextPoints(text) {
    const temp = document.createElement("canvas");
    const tempCtx = temp.getContext("2d");
    temp.width = canvas.width;
    temp.height = canvas.height;
    tempCtx.font = "bold 100px Roboto Condensed";
    tempCtx.textAlign = "center";
    tempCtx.fillText(text, canvas.width / 2, canvas.height / 2);
    const data = tempCtx.getImageData(0, 0, temp.width, temp.height);
    const pts = [];
    for (let y = 0; y < temp.height; y += 3) {
      for (let x = 0; x < temp.width; x += 3) {
        if (data.data[(y * temp.width + x) * 4 + 3] > 128) pts.push({ x, y });
      }
    }
    return pts;
  }

  function createParticles(points) {
    const particleColor = "pink";
    particles = points.map((p) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      targetX: p.x,
      targetY: p.y,
      vx: 0,
      vy: 0,
      color: particleColor,
    }));
  }

  function updateParticles() {
    particles.forEach((p) => {
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      

      if (mode === "gather") {
        p.vx += dx * 0.01;
p.vy += dy * 0.01;

        p.vx *= 0.85;
        p.vy *= 0.85;
      }
      p.x += p.vx;
      p.y += p.vy;
    });
  }

  function drawParticles() {
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }

  function animateParticles() {
    updateParticles();
    drawParticles();
    animationFrameParticles = requestAnimationFrame(animateParticles);
  }

  function nextText() {
    if (currentText >= texts.length) {
      finishEffect();
      return;
    }

    const points = createTextPoints(texts[currentText]);
    createParticles(points);
    animateParticles();

    
    setTimeout(() => (mode = "gather"), 2000);
    setTimeout(() => {
  mode = "explode";
  particles.forEach((p) => {
    p.vx = (Math.random() - 0.5) * 12;
    p.vy = (Math.random() - 0.5) * 12;
  });
}, 4000);

    currentText++;
    setTimeout(nextText, 5000);
  }

  nextText();

  // ------------------ END EVENT ------------------
  function finishEffect() {
    setTimeout(() => {
      cancelAnimationFrame(animationFrameMatrix);
      cancelAnimationFrame(animationFrameParticles);

      canvas.style.display = "none";
      document.getElementById("trang2").style.display = "none";
      document.getElementById("trang3").style.display = "block";

      playTypingText();
    }, 1000);
  }
}

// ✅ TEXT TYPING + HEART EFFECT FOR PAGE 3
let typingRunning = false; // thêm dòng này ở đầu file hoặc trên cùng JS

function playTypingText() {
  if (typingRunning) return; // chặn chạy trùng
  typingRunning = true;

  const trang3 = document.getElementById("trang3");
  let noiDung = document.getElementById("noiDung");

  // nếu chưa có p#noiDung thì tạo mới
  if (!noiDung) {
    noiDung = document.createElement("p");
    noiDung.id = "noiDung";
    trang3.appendChild(noiDung);
  }

  noiDung.innerHTML = ""; // xóa text cũ

  const text =
    "Hay quá ha cuối cùng bạn tui cũng thêm tuổi mới rùi he, bằng tuổi tui rùi chứ bình thường phải gọi người ta là chị đó nha. Thui thì tuổi mới chúc bạn nhỏ hạnh phúc(cái này thì nhất đinh ròi vì có người bạn tuyệt vời như tui mò 🤭🤭🤭), xinh đẹp (hoi thừa vì bình thường cũng xinh lắm rùi nhưng sau sẽ xinh hơn🥰),và những môn thì sau nhất nhất định sẽ được tích A.Đấy chỉ thế thui nói ít mong bạn hiểu nhìu và cuối cùng là HAPPY BIRTHDAYYYYYYYYYYYYYYYY❤️❤️❤️❤️❤️❤️ ";

  let index = 0;

  const typing = setInterval(() => {
    if (index < text.length) {
      const char = text.charAt(index);
      if (char === "\n") {
        noiDung.appendChild(document.createElement("br"));
      } else {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.marginRight = "2px";
        span.style.opacity = 0;
        span.style.fontFamily = "Poppins, sans-serif";
        noiDung.appendChild(span);

        requestAnimationFrame(() => {
          span.style.transition = "opacity 0.25s";
          span.style.opacity = 1;
        });
      }
      index++;
    } else {
      clearInterval(typing);
      hieuUngDangChay = setInterval(taoTraiTim, 1000);
    }
  }, 80);
}

// ❤️ HEART FLY EFFECT
function taoTraiTim() {
  const container = document.getElementById("confetti-container");

  for (let i = 0; i < 60; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDelay = Math.random() * 2 + "s";
    container.appendChild(heart);

    setTimeout(() => heart.remove(), 4000);
  }
}

