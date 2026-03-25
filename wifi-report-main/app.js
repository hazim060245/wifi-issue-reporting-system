document.addEventListener('DOMContentLoaded', () => {
    const supabaseUrl = 'https://fvzcusbcleyytjnyzgib.supabase.co';
    const supabaseKey = 'sb_publishable_ZFBeEQ9zscxS-MNLwhSbZQ_KGgQJMHf';
    const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    // --- Theme Logic ---
    const themes = ['light', 'dark', 'pink'];
    let currentThemeIndex = themes.indexOf(localStorage.getItem('wifi_theme') || 'light');
    if(currentThemeIndex === -1) currentThemeIndex = 0;

    function applyTheme() {
        const theme = themes[currentThemeIndex];
        if(theme === 'light') document.body.removeAttribute('data-theme');
        else document.body.setAttribute('data-theme', theme);
        localStorage.setItem('wifi_theme', theme);
        
        // Update icon
        const icon = themeToggleBtn.querySelector('i');
        if(icon) {
            icon.className = theme === 'light' ? 'bx bx-sun' : 
                            theme === 'dark' ? 'bx bx-moon' : 'bx bx-infinite';
        }
    }
    
    const themeToggleBtn = document.getElementById('globalThemeToggle');
    applyTheme();
    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            applyTheme();
        });
    }

    // --- Login Logic ---
    const loginForm = document.getElementById('loginForm');
    const loginContainer = document.getElementById('loginContainer');
    const appContainer = document.getElementById('appContainer');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usernameVal = document.getElementById('username').value;
        const fullNameVal = document.getElementById('fullName').value;

        if (!usernameVal || !fullNameVal) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        // Save to localStorage
        localStorage.setItem('wifi_user_id', usernameVal);
        localStorage.setItem('wifi_user_name', fullNameVal);
        
        const btn = loginForm.querySelector('.login-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> กำลังเข้าสู่ระบบ...`;
        btn.style.opacity = "0.8";
        btn.disabled = true;

        // Mock login delay
        setTimeout(() => {
            loginContainer.classList.add('fade-out-up');
            
            setTimeout(() => {
                loginContainer.style.display = 'none';
                appContainer.style.display = 'flex';
                // Trigger reflow for animation
                void appContainer.offsetWidth;
                appContainer.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }, 500); // Wait for fade out
        }, 800);
    });

    // --- Signal Rating Logic ---
    const signalContainer = document.querySelector('.signal-rating');
    const signalText = document.getElementById('signalText');
    
    // Replace default radios with custom interactive icons
    const signalHTML = `
        <div class="custom-signal">
            <i class='bx bxs-wifi signal-bar-icon' data-val="1" title="1 ขีด (แย่มาก)"></i>
            <i class='bx bx-wifi-1 signal-bar-icon' style="display:none;"></i>
            <i class='bx bx-wifi-2 signal-bar-icon' data-val="2" title="2 ขีด (แย่)"></i>
            <i class='bx bx-wifi signal-bar-icon' data-val="3" title="3 ขีด (ปานกลาง)" style="opacity:0.7"></i>
            <i class='bx bx-wifi signal-bar-icon' data-val="4" title="4 ขีด (ดี)"></i>
        </div>
        <input type="hidden" id="signalValue" name="signalValue" required>
    `;
    // For Wifi we can just use generic circles or bars to be easier, let's use circle icons to represent bars
    signalContainer.innerHTML = `
        <div class="custom-signal">
            <i class='bx bxs-bar-chart-alt-2 signal-bar-icon' data-val="1" style="transform: scaleY(0.4);"></i>
            <i class='bx bxs-bar-chart-alt-2 signal-bar-icon' data-val="2" style="transform: scaleY(0.6);"></i>
            <i class='bx bxs-bar-chart-alt-2 signal-bar-icon' data-val="3" style="transform: scaleY(0.8);"></i>
            <i class='bx bxs-bar-chart-alt-2 signal-bar-icon' data-val="4" style="transform: scaleY(1);"></i>
        </div>
        <input type="hidden" id="signalValue" name="signalValue" required>
    `;

    const signalIcons = document.querySelectorAll('.signal-bar-icon');
    const signalInput = document.getElementById('signalValue');
    
    const signalTexts = {
        1: "1 ขีด - สัญญาณอ่อนมาก ช้าจนใช้งานยาก",
        2: "2 ขีด - สัญญาณอ่อน ใช้งานได้บ้าง",
        3: "3 ขีด - สัญญาณปานกลาง แต่มีหลุด",
        4: "4 ขีด - สัญญาณเต็มขีด แต่เน็ตไม่วิ่ง"
    };

    const signalColors = {
        1: "#f72585", // danger
        2: "#f8961e", // warning
        3: "#4cc9f0", // success-ish
        4: "#4361ee"  // primary
    };

    signalIcons.forEach(icon => {
        icon.addEventListener('mouseover', function() {
            const val = this.getAttribute('data-val');
            highlightSignals(val, true);
        });

        icon.addEventListener('mouseout', function() {
            highlightSignals(signalInput.value, false);
        });

        icon.addEventListener('click', function() {
            const val = this.getAttribute('data-val');
            signalInput.value = val;
            highlightSignals(val, false);
            signalText.textContent = signalTexts[val];
            signalText.style.color = signalColors[val];
            signalText.style.fontWeight = "600";
        });
    });

    function highlightSignals(val, isHover) {
        signalIcons.forEach(icon => {
            const iconVal = icon.getAttribute('data-val');
            const baseScale = 0.2 + (iconVal * 0.2); // 0.4, 0.6, 0.8, 1.0
            
            if (iconVal <= val) {
                icon.style.color = signalColors[val] || '#f8961e';
                icon.style.transform = isHover ? `scaleY(${baseScale}) scaleX(1.2)` : `scaleY(${baseScale})`;
            } else {
                icon.style.color = '#d1d5db';
                icon.style.transform = `scaleY(${baseScale})`;
            }
        });
    }

    // --- Dashboard Data ---
    // Form Elements
    const locationOptions = ["อาคาร1", "อาคาร2", "อาคาร3", "อาคารอเนกประสงค์", "อาคาร4", "อาคาร5", "อาคาร6", "อาคารศูนย์อาหาร1", "อาคารสำนักงานกลาง", "อาคาร9", "อาคาร10", "อาคาร11", "อาคารศูนย์มีเดีย", "อื่นๆ"];
    let topSpots = locationOptions.map((loc, index) => ({ name: loc, count: 0, rank: index + 1 }));

    const spotsList = document.getElementById('topSpotsList');
    
    // Render Spots
    function renderSpots() {
        spotsList.innerHTML = '';
        topSpots.forEach((spot, index) => {
            const rankClass = spot.rank <= 5 ? `item-rank-${spot.rank}` : 'item-rank-others';
            
            const html = `
                <div class="spot-item ${rankClass}" style="animation: fadeIn 0.5s ease-out ${index * 0.1}s backwards;">
                    <div class="spot-rank">${spot.rank}</div>
                    <div class="spot-info">
                        <div class="spot-name">${spot.name}</div>
                        <div class="spot-bar-bg">
                            <div class="spot-bar-fill" ${spot.count === 0 ? 'style="width: 0%;"' : ''}></div>
                        </div>
                    </div>
                    <div class="spot-count">${spot.count} ครั้ง</div>
                </div>
            `;
            spotsList.innerHTML += html;
        });
    }

    async function loadDashboardData() {
        const { data: issues, error } = await supabaseClient
            .from('wifi_reports')
            .select('*');
        if (!error && issues) {
            const resetRows = issues.filter(i => i.location === 'SYSTEM_RESET');
            let resetTime = 0;
            if (resetRows.length > 0) {
                const latestReset = resetRows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
                resetTime = new Date(latestReset.created_at).getTime();
            }

            // Reset counts
            topSpots.forEach(s => s.count = 0);
            
            issues.forEach(issue => {
                if (issue.location === 'SYSTEM_RESET') return;
                const issueTime = new Date(issue.created_at).getTime();
                if (issueTime < resetTime) return;

                const loc = issue.location;
                const spot = topSpots.find(s => s.name === loc);
                if (spot) {
                    spot.count++;
                } else if (loc && loc !== "อื่นๆ") {
                    topSpots.push({ name: loc, count: 1, rank: 99 });
                }
            });
            
            topSpots.sort((a,b) => b.count - a.count);
            topSpots.forEach((s, i) => s.rank = i + 1);
            renderSpots();
        }
    }

    loadDashboardData();

    // --- Form Submission ---
    const form = document.getElementById('issueForm');
    const toast = document.getElementById('toast');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validation check for custom signal
        if (!signalInput.value) {
            signalText.textContent = "กรุณาเลือกระดับสัญญาณที่พบ!";
            signalText.style.color = "#f72585";
            
            // Shake animation
            const sigGroup = document.querySelector('.custom-signal');
            sigGroup.style.animation = "shake 0.5s";
            setTimeout(() => sigGroup.style.animation = "", 500);
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> กำลังส่งข้อมูล...`;
        btn.style.opacity = "0.8";
        btn.disabled = true;

        // --- ส่งข้อมูลไปยัง Backend API ---
        const student_id = localStorage.getItem('wifi_user_id') || 'ไม่ระบุ';
        const fullname = localStorage.getItem('wifi_user_name') || 'ไม่ระบุ';

        const payload = {
            student_id,
            fullname,
            location: document.getElementById('location').value,
            room: document.getElementById('room').value,
            problem: document.querySelector('input[name="problem"]:checked').value,
            signal: parseInt(signalInput.value),
            details: document.getElementById('details').value || "-"
        };

        try {
            const { data: result, error } = await supabaseClient
                .from('wifi_reports')
                .insert([
                    {
                        username: `${payload.student_id} - ${payload.fullname}`,
                        location: payload.location,
                        room: payload.room,
                        problem: payload.problem,
                        signal_level: payload.signal,
                        details: payload.details
                    }
                ]);

            if (error) throw error;

            // แสดงแจ้งเตือนเมื่อสำเร็จ
            toast.classList.add('show');
            
            // อัปเดต Dashboard ฝั่ง Client (จำลอง)
            const selLoc = payload.location;
            const spotToUpdate = topSpots.find(spot => spot.name === selLoc);
            if(spotToUpdate) {
                spotToUpdate.count++;
            } else if (selLoc !== "อื่นๆ" && selLoc) {
                topSpots.push({ name: selLoc, count: 1, rank: 99 });
            }
            
            topSpots.sort((a,b) => b.count - a.count);
            topSpots.forEach((s, i) => s.rank = i + 1);
            renderSpots(); 

            // รีเซ็ตฟอร์ม
            form.reset();
            signalInput.value = "";
            highlightSignals(0, false);
            signalText.textContent = "เลือกขีดสัญญาณ";
            signalText.style.color = "var(--text-muted)";
            signalText.style.fontWeight = "500";

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3500);

        } catch (error) {
            console.error('Error!', error.message);
            alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
        } finally {
            // ดึงปุ่มกลับสู่สภาพเดิม
            btn.innerHTML = originalText;
            btn.style.opacity = "1";
            btn.disabled = false;
        }
    });
});

// Add global shake keyframes dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  50% { transform: translateX(8px); }
  75% { transform: translateX(-8px); }
  100% { transform: translateX(0); }
}
`;
document.head.appendChild(style);
