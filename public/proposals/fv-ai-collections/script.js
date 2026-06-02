// ===========================================
// Joint Venture Proposal Presentation JS
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const counter = document.getElementById('slideCounter');
  const scrollHint = document.getElementById('scrollHint');
  const totalSlides = slides.length;

  // --- Slide counter via IntersectionObserver ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const slideIndex = Array.from(slides).indexOf(entry.target) + 1;
        if (counter) {
          counter.textContent = `${slideIndex} / ${totalSlides}`;
        }

        // Hide scroll hint after first slide
        if (scrollHint && slideIndex > 1) {
          scrollHint.style.opacity = '0';
          scrollHint.style.pointerEvents = 'none';
        } else if (scrollHint) {
          scrollHint.style.opacity = '1';
        }

        // Animate elements in view
        entry.target.querySelectorAll('.opp-card, .arch-step, .leverage-card, .gov-box, .tranche-item, .syn-card, .exit-col, .step-check').forEach((el, i) => {
          el.style.animationDelay = `${i * 0.08}s`;
          el.classList.add('animate-in');
        });
      }
    });
  }, observerOptions);

  slides.forEach(slide => observer.observe(slide));

  // --- Keyboard navigation ---
  document.addEventListener('keydown', (e) => {
    const currentSlide = getCurrentSlide();
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      navigateToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateToSlide(currentSlide - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      navigateToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      navigateToSlide(totalSlides - 1);
    }
  });

  function getCurrentSlide() {
    let current = 0;
    const scrollY = window.scrollY + window.innerHeight / 2;
    
    slides.forEach((slide, index) => {
      if (scrollY >= slide.offsetTop) {
        current = index;
      }
    });
    
    return current;
  }

  function navigateToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    
    slides[index].scrollIntoView({ behavior: 'smooth' });
  }

  // --- Animate-in CSS injection ---
  const style = document.createElement('style');
  style.textContent = `
    .opp-card, .arch-step, .leverage-card, .gov-box, .tranche-item, .syn-card, .exit-col, .step-check {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);


  // =============================================
  // Interactive Financial Projections Calculator
  // =============================================
  
  const scenarios = {
    poor: {
      label: "Poor Results (0.5% Liquidation)",
      notes: "JV terminates in Month 2 due to capital depletion. Tranche 2 released but cannot sustain cash lag with 0.5% liquidation rate.",
      highlight: "JV Terminated (Deficit)",
      highlightColor: "#EF4444",
      ledger: [
        { month: "Day 1", tranche: "$10,000", exp: "-", liq: "-", col: "-", rev: "-", flow: "-", bal: 10000 },
        { month: "Month 1", tranche: "-", exp: "$8,500", liq: "0.0%", col: "$0", rev: "$0", flow: "-$8,500", bal: 1500 },
        { month: "Month 2", tranche: "$5,000", exp: "$8,250", liq: "0.2%", col: "$2,000", rev: "$700", flow: "-$7,550", bal: -1050 },
        { month: "Month 3", tranche: "Blocked", exp: "-", liq: "-", col: "-", rev: "-", flow: "-", bal: 0 },
        { month: "Month 4", tranche: "-", exp: "-", liq: "-", col: "-", rev: "-", flow: "-", bal: 0 },
        { month: "Month 5", tranche: "-", exp: "-", liq: "-", col: "-", rev: "-", flow: "-", bal: 0 },
        { month: "Month 6", tranche: "-", exp: "-", liq: "-", col: "-", rev: "-", flow: "-", bal: 0 }
      ],
      chartData: [10000, 1500, -1050, 0, 0, 0, 0]
    },
    average: {
      label: "Average Results (1.5% Liquidation)",
      notes: "Sustained positive cash flow starting Month 3. Tranches released successfully. Final Cumulative Cash: <strong>$31,550</strong>.",
      highlight: "$31,550 Cumulative Cash",
      highlightColor: "#10B981",
      ledger: [
        { month: "Day 1", tranche: "$10,000", exp: "-", liq: "-", col: "-", rev: "-", flow: "-", bal: 10000 },
        { month: "Month 1", tranche: "-", exp: "$8,500", liq: "0.0%", col: "$0", rev: "$0", flow: "-$8,500", bal: 1500 },
        { month: "Month 2", tranche: "$5,000", exp: "$8,250", liq: "0.5%", col: "$8,000", rev: "$2,800", flow: "-$5,450", bal: 1050 },
        { month: "Month 3", tranche: "$5,000", exp: "$8,250", liq: "1.5%", col: "$28,000", rev: "$9,800", flow: "+$1,550", bal: 7600 },
        { month: "Month 4", tranche: "-", exp: "$8,250", liq: "2.0%", col: "$42,000", rev: "$14,700", flow: "+$6,450", bal: 14050 },
        { month: "Month 5", tranche: "-", exp: "$8,250", liq: "2.2%", col: "$45,700", rev: "$16,000", flow: "+$7,750", bal: 21800 },
        { month: "Month 6", tranche: "-", exp: "$8,250", liq: "2.5%", col: "$51,400", rev: "$18,000", flow: "+$9,750", bal: 31550 }
      ],
      chartData: [10000, 1500, 1050, 7600, 14050, 21800, 31550]
    },
    exceptional: {
      label: "Exceptional Results (3.0% Liquidation)",
      notes: "Massive profitability. Tranche 3 not needed since cash balance stays positive without it. Final Cumulative Cash: <strong>$92,850</strong>.",
      highlight: "$92,850 Cumulative Cash",
      highlightColor: "#00E5FF",
      ledger: [
        { month: "Day 1", tranche: "$10,000", exp: "-", liq: "-", col: "-", rev: "-", flow: "-", bal: 10000 },
        { month: "Month 1", tranche: "-", exp: "$8,500", liq: "0.0%", col: "$0", rev: "$0", flow: "-$8,500", bal: 1500 },
        { month: "Month 2", tranche: "$5,000", exp: "$8,250", liq: "1.0%", col: "$16,000", rev: "$5,600", flow: "-$2,650", bal: 3850 },
        { month: "Month 3", tranche: "$5,000", exp: "$8,250", liq: "3.0%", col: "$56,000", rev: "$19,600", flow: "+$11,350", bal: 20200 },
        { month: "Month 4", tranche: "-", exp: "$8,250", liq: "3.5%", col: "$84,000", rev: "$29,400", flow: "+$21,150", bal: 41350 },
        { month: "Month 5", tranche: "-", exp: "$8,250", liq: "3.8%", col: "$91,400", rev: "$32,000", flow: "+$23,750", bal: 65100 },
        { month: "Month 6", tranche: "-", exp: "$8,250", liq: "4.0%", col: "$102,800", rev: "$36,000", flow: "+$27,750", bal: 92850 }
      ],
      chartData: [10000, 1500, 3850, 20200, 41350, 65100, 92850]
    }
  };

  const tbody = document.getElementById('ledgerBody');
  const highlightEl = document.getElementById('statHighlight');
  const canvas = document.getElementById('ledgerChart');
  const toggleBtns = document.querySelectorAll('.toggle-btn');

  function updateScenario(type) {
    const sc = scenarios[type];
    
    // Update active button styling
    toggleBtns.forEach(btn => {
      if (btn.dataset.scenario === type) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Populate table
    tbody.innerHTML = '';
    sc.ledger.forEach(row => {
      const tr = document.createElement('tr');
      const formattedBal = typeof row.bal === 'number' ? '$' + row.bal.toLocaleString() : row.bal;
      if (row.month === "Month 2" && type === "poor") {
        tr.classList.add('highlight-row');
      }
      
      tr.innerHTML = `
        <td><strong>${row.month}</strong></td>
        <td>${row.tranche}</td>
        <td>${row.exp}</td>
        <td>${row.liq}</td>
        <td>${row.col}</td>
        <td>${row.rev}</td>
        <td><span style="color: ${row.flow.startsWith('+') ? 'var(--green)' : row.flow.startsWith('-') ? 'var(--red)' : 'inherit'}">${row.flow}</span></td>
        <td><strong>${formattedBal}</strong></td>
      `;
      tbody.appendChild(tr);
    });

    // Populate highlight cards
    highlightEl.innerHTML = `
      <div class="stat-val" style="color: ${sc.highlightColor}">${sc.highlight}</div>
      <div class="stat-lbl">${sc.notes}</div>
    `;

    // Redraw chart
    drawChart(sc.chartData, sc.highlightColor);
  }

  function drawChart(dataPoints, lineColor) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement.clientWidth - 48;
    const height = 180;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Chart dimensions
    const padding = { top: 20, right: 15, bottom: 25, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...dataPoints, 10000) * 1.1;
    const minVal = Math.min(...dataPoints, 0) - 1000;

    const xScale = (i) => padding.left + (i / (dataPoints.length - 1)) * chartW;
    const yScale = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

    // Background
    ctx.fillStyle = 'rgba(11, 15, 25, 0.4)';
    ctx.fillRect(0, 0, width, height);

    // Grid lines & Y Axis Ticks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const yGridSteps = 4;
    for (let i = 0; i <= yGridSteps; i++) {
      const val = minVal + ((maxVal - minVal) / yGridSteps) * i;
      const y = yScale(val);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const label = val >= 1000 ? '$' + Math.round(val / 1000) + 'k' : val < 0 ? '-$' + Math.round(Math.abs(val)) : '$' + Math.round(val);
      ctx.fillText(label, padding.left - 6, y);
    }

    // Zero Line
    if (minVal < 0) {
      const zeroY = yScale(0);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(padding.left, zeroY);
      ctx.lineTo(width - padding.right, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // X Axis Labels
    const months = ["Start", "M1", "M2", "M3", "M4", "M5", "M6"];
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    months.forEach((m, i) => {
      const x = xScale(i);
      ctx.fillText(m, x, padding.top + chartH + 6);
    });

    // Draw Line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    dataPoints.forEach((val, i) => {
      if (i === 0) ctx.moveTo(xScale(i), yScale(val));
      else ctx.lineTo(xScale(i), yScale(val));
    });
    ctx.stroke();

    // Draw area gradient
    const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    grad.addColorStop(0, lineColor + '40'); // 25% opacity Hex
    grad.addColorStop(1, lineColor + '00'); // 0% opacity Hex
    ctx.fillStyle = grad;
    ctx.lineTo(xScale(dataPoints.length - 1), yScale(minVal));
    ctx.lineTo(xScale(0), yScale(minVal));
    ctx.closePath();
    ctx.fill();

    // Draw dots
    dataPoints.forEach((val, i) => {
      ctx.beginPath();
      ctx.arc(xScale(i), yScale(val), i === dataPoints.length - 1 ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();
      ctx.strokeStyle = 'var(--navy)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  // Bind scenario toggle buttons
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      updateScenario(btn.dataset.scenario);
    });
  });

  // Init default Average scenario when slide 7 is visible
  const projSlide = document.getElementById('slide-7');
  if (projSlide) {
    const projObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateScenario('average');
          projObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    projObserver.observe(projSlide);
  }
});
