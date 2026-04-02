/* ============================================
   APPOINTMENT ENGINE — AI Chat + Voice + Form
   ============================================ */

const AppointmentEngine = {
  step: 0,
  data: {},
  isListening: false,
  recognition: null,

  steps: [
    { key: 'name', prompt: "Hello! 👋 I'm the Medifort AI assistant. Let's book your appointment.\n\nWhat's your full name?" },
    { key: 'department', prompt: "Great to meet you, {name}! 😊\n\nWhich department would you like to visit?\n\nPlease choose one:" },
    { key: 'doctor', prompt: "Excellent choice! Here are the available doctors in **{department}**:\n\nPlease select a doctor:" },
    { key: 'date', prompt: "You'll be seeing **{doctor}**. 👨‍⚕️\n\nWhat date would you prefer? (Please type a date like 'March 20' or '2026-03-20')" },
    { key: 'time', prompt: "Almost done! ⏰\n\nWhat time slot works best for you?" },
    { key: 'confirm', prompt: "Perfect! Here's your appointment summary:" }
  ],

  timeSlots: ['Morning (9 AM – 12 PM)', 'Afternoon (12 – 3 PM)', 'Evening (3 – 6 PM)'],

  /* --- Initialize --- */
  init() {
    this.step = 0;
    this.data = {};
    this.isListening = false;

    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) chatMessages.innerHTML = '';

    // Start conversation
    setTimeout(() => this.showStep(), 400);

    // Setup input handlers
    const sendBtn = document.getElementById('chat-send-btn');
    const chatInput = document.getElementById('chat-input');
    const micBtn = document.getElementById('chat-mic-btn');

    if (sendBtn) {
      sendBtn.onclick = () => this.handleUserInput();
    }
    if (chatInput) {
      chatInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleUserInput();
        }
      };
    }
    if (micBtn) {
      micBtn.onclick = () => this.toggleVoice();
    }

    // Setup voice recognition
    this.setupSpeechRecognition();

    // Set min date on form
    const formDate = document.getElementById('form-date');
    if (formDate) {
      const today = new Date().toISOString().split('T')[0];
      formDate.setAttribute('min', today);
    }
  },

  /* --- Show current step --- */
  showStep() {
    const step = this.steps[this.step];
    let prompt = step.prompt;

    // Replace placeholders
    Object.keys(this.data).forEach(key => {
      prompt = prompt.replace(`{${key}}`, this.data[key]);
    });

    this.addBotMessage(prompt);

    // Show relevant choices
    if (step.key === 'department') {
      this.showDepartmentChoices();
    } else if (step.key === 'doctor') {
      this.showDoctorChoices();
    } else if (step.key === 'time') {
      this.showTimeChoices();
    } else if (step.key === 'confirm') {
      this.showConfirmation();
    }
  },

  /* --- Choice renderers --- */
  showDepartmentChoices() {
    const container = document.createElement('div');
    container.className = 'chat-choices';
    DEPARTMENTS.forEach(dept => {
      const btn = document.createElement('button');
      btn.className = 'chat-choice-btn';
      btn.textContent = `${dept.icon} ${dept.name}`;
      btn.onclick = () => {
        this.addUserMessage(dept.name);
        this.data.department = dept.name;
        this.removeChoices();
        this.step++;
        setTimeout(() => this.showStep(), 500);
      };
      container.appendChild(btn);
    });
    document.getElementById('chat-messages').appendChild(container);
    this.scrollChat();
  },

  showDoctorChoices() {
    const deptDoctors = DOCTORS.filter(d =>
      d.department.toLowerCase() === this.data.department.toLowerCase()
    );
    const container = document.createElement('div');
    container.className = 'chat-choices';

    if (deptDoctors.length === 0) {
      // Show all doctors as fallback
      DOCTORS.forEach(doc => this.createDoctorChoiceBtn(container, doc));
    } else {
      deptDoctors.forEach(doc => this.createDoctorChoiceBtn(container, doc));
    }

    // Add "Any available" option
    const anyBtn = document.createElement('button');
    anyBtn.className = 'chat-choice-btn';
    anyBtn.textContent = '🔄 Any Available Doctor';
    anyBtn.onclick = () => {
      const selectedDoc = deptDoctors.length > 0 ? deptDoctors[0].name : DOCTORS[0].name;
      this.addUserMessage('Any Available Doctor');
      this.data.doctor = selectedDoc;
      this.removeChoices();
      this.step++;
      setTimeout(() => this.showStep(), 500);
    };
    container.appendChild(anyBtn);

    document.getElementById('chat-messages').appendChild(container);
    this.scrollChat();
  },

  createDoctorChoiceBtn(container, doc) {
    const btn = document.createElement('button');
    btn.className = 'chat-choice-btn';
    btn.innerHTML = `${doc.avatar} ${doc.name} <span style="opacity:0.6;font-size:0.85em;">— ${doc.qualifications}</span>`;
    btn.onclick = () => {
      this.addUserMessage(doc.name);
      this.data.doctor = doc.name;
      this.removeChoices();
      this.step++;
      setTimeout(() => this.showStep(), 500);
    };
    container.appendChild(btn);
  },

  showTimeChoices() {
    const container = document.createElement('div');
    container.className = 'chat-choices';
    this.timeSlots.forEach(slot => {
      const btn = document.createElement('button');
      btn.className = 'chat-choice-btn';
      btn.textContent = `⏰ ${slot}`;
      btn.onclick = () => {
        this.addUserMessage(slot);
        this.data.time = slot;
        this.removeChoices();
        this.step++;
        setTimeout(() => this.showStep(), 500);
      };
      container.appendChild(btn);
    });
    document.getElementById('chat-messages').appendChild(container);
    this.scrollChat();
  },

  showConfirmation() {
    const container = document.createElement('div');
    container.className = 'chat-confirmation';
    container.innerHTML = `
      <div class="chat-confirm-card">
        <h4>📋 Appointment Details</h4>
        <div class="confirm-row"><span>Patient</span><strong>${this.data.name}</strong></div>
        <div class="confirm-row"><span>Department</span><strong>${this.data.department}</strong></div>
        <div class="confirm-row"><span>Doctor</span><strong>${this.data.doctor}</strong></div>
        <div class="confirm-row"><span>Date</span><strong>${this.data.date}</strong></div>
        <div class="confirm-row"><span>Time</span><strong>${this.data.time}</strong></div>
        <div class="confirm-actions">
          <button class="btn btn-accent" onclick="AppointmentEngine.confirmAppointment()">✅ Confirm Booking</button>
          <button class="btn btn-outline" onclick="AppointmentEngine.startOver()">🔄 Start Over</button>
        </div>
      </div>
    `;
    document.getElementById('chat-messages').appendChild(container);
    this.scrollChat();
  },

  /* --- Handle user input --- */
  handleUserInput() {
    const input = document.getElementById('chat-input');
    if (!input) return;

    const value = input.value.trim();
    if (!value) return;

    input.value = '';
    const step = this.steps[this.step];

    this.addUserMessage(value);
    this.removeChoices();

    if (step.key === 'name') {
      this.data.name = value;
      this.step++;
      setTimeout(() => this.showStep(), 500);
    } else if (step.key === 'date') {
      this.data.date = value;
      this.step++;
      setTimeout(() => this.showStep(), 500);
    } else if (step.key === 'department') {
      // Try to match typed department
      const match = DEPARTMENTS.find(d =>
        d.name.toLowerCase().includes(value.toLowerCase())
      );
      if (match) {
        this.data.department = match.name;
        this.step++;
        setTimeout(() => this.showStep(), 500);
      } else {
        this.addBotMessage("I couldn't find that department. Please select from the options below.");
        setTimeout(() => this.showDepartmentChoices(), 300);
      }
    } else if (step.key === 'doctor') {
      const match = DOCTORS.find(d =>
        d.name.toLowerCase().includes(value.toLowerCase())
      );
      if (match) {
        this.data.doctor = match.name;
        this.step++;
        setTimeout(() => this.showStep(), 500);
      } else {
        this.addBotMessage("I couldn't find that doctor. Please select from the options below.");
        setTimeout(() => this.showDoctorChoices(), 300);
      }
    } else if (step.key === 'time') {
      this.data.time = value;
      this.step++;
      setTimeout(() => this.showStep(), 500);
    }
  },

  /* --- Confirmation actions --- */
  async confirmAppointment() {
    // Find doctor ID from name
    const doctor = DOCTORS.find(d => d.name === this.data.doctor);
    const payload = {
      patient_name: this.data.name,
      department: this.data.department,
      doctor_id: doctor ? doctor.id : null,
      preferred_date: this.data.date,
      preferred_time: this.data.time
    };

    // Try to POST to API
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/appointments`, {
          method: 'POST',
          headers: Auth.headers(),
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          this.addBotMessage("🎉 **Your appointment has been booked!**\n\nAppointment ID: **#" + data.appointment.id + "**\n\nYou'll receive a confirmation via email shortly. Thank you for choosing Medifort Wellness Hospital!");
          return;
        }
      } catch (e) { /* fallback below */ }
    }
    this.addBotMessage("🎉 **Your appointment has been booked!**\n\nYou'll receive a confirmation via email and SMS shortly. Thank you for choosing Medifort Wellness Hospital!\n\n_Note: This is a demo — no real booking was created._");
  },

  startOver() {
    this.step = 0;
    this.data = {};
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) chatMessages.innerHTML = '';
    setTimeout(() => this.showStep(), 300);
  },

  /* --- Message renderers --- */
  addBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-message bot-message';
    // Simple markdown-like bold
    const formatted = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    msg.innerHTML = `
      <div class="chat-avatar bot-avatar">🤖</div>
      <div class="chat-bubble bot-bubble">${formatted}</div>
    `;
    document.getElementById('chat-messages').appendChild(msg);
    this.scrollChat();
  },

  addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-message user-message';
    msg.innerHTML = `
      <div class="chat-bubble user-bubble">${text}</div>
      <div class="chat-avatar user-avatar">${Components.userIcon()}</div>
    `;
    document.getElementById('chat-messages').appendChild(msg);
    this.scrollChat();
  },

  removeChoices() {
    document.querySelectorAll('.chat-choices').forEach(el => el.remove());
  },

  scrollChat() {
    const container = document.getElementById('chat-messages');
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  },

  /* --- Tab switching --- */
  switchTab(tab) {
    const chatContainer = document.getElementById('chat-container');
    const formContainer = document.getElementById('form-container');
    const tabChat = document.getElementById('tab-chat');
    const tabForm = document.getElementById('tab-form');

    if (tab === 'chat') {
      if (chatContainer) chatContainer.style.display = 'flex';
      if (formContainer) formContainer.style.display = 'none';
      if (tabChat) tabChat.classList.add('active');
      if (tabForm) tabForm.classList.remove('active');
    } else {
      if (chatContainer) chatContainer.style.display = 'none';
      if (formContainer) formContainer.style.display = 'block';
      if (tabChat) tabChat.classList.remove('active');
      if (tabForm) tabForm.classList.add('active');
    }
  },

  /* --- Manual form submission --- */
  async submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('form-name')?.value || '';
    const phone = document.getElementById('form-phone')?.value || '';
    const department = document.getElementById('form-department')?.value || '';
    const doctor = document.getElementById('form-doctor')?.value || 'Any Available';
    const date = document.getElementById('form-date')?.value || '';
    const time = document.getElementById('form-time')?.value || '';
    const notes = document.getElementById('form-notes')?.value || '';

    // Simple validation
    if (!name || !phone || !department || !date) {
      alert('Please fill in all required fields.');
      return;
    }

    // Find doctor ID
    const doctorObj = DOCTORS.find(d => d.name === doctor);
    let appointmentId = null;

    // POST to API if available
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/appointments`, {
          method: 'POST',
          headers: Auth.headers(),
          body: JSON.stringify({
            patient_name: name,
            patient_phone: phone,
            patient_email: Auth.user?.email || '',
            department,
            doctor_id: doctorObj ? doctorObj.id : null,
            preferred_date: date,
            preferred_time: time,
            notes
          })
        });
        const data = await res.json();
        if (res.ok) appointmentId = data.appointment.id;
      } catch (e) { /* continue with success UI anyway */ }
    }

    // Show success
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
      formContainer.innerHTML = `
        <div class="form-success">
          <div class="form-success-icon">✅</div>
          <h3>Appointment Booked!</h3>
          ${appointmentId ? `<p style="color:var(--primary); font-weight:600; margin-bottom:var(--space-4);">Appointment ID: #${appointmentId}</p>` : ''}
          <div class="form-success-details">
            <div class="confirm-row"><span>Patient</span><strong>${name}</strong></div>
            <div class="confirm-row"><span>Phone</span><strong>${phone}</strong></div>
            <div class="confirm-row"><span>Department</span><strong>${department}</strong></div>
            <div class="confirm-row"><span>Doctor</span><strong>${doctor}</strong></div>
            <div class="confirm-row"><span>Date</span><strong>${date}</strong></div>
            <div class="confirm-row"><span>Time</span><strong>${time}</strong></div>
            ${notes ? `<div class="confirm-row"><span>Notes</span><strong>${notes}</strong></div>` : ''}
          </div>
          ${!appointmentId ? '<p style="margin-top:var(--space-4); color:var(--text-muted); font-size:var(--fs-sm);"><em>This is a demo — no real booking was created.</em></p>' : '<p style="margin-top:var(--space-4); color:var(--text-muted); font-size:var(--fs-sm);">Our team will contact you to confirm your appointment.</p>'}
          <button class="btn btn-primary" onclick="AppointmentEngine.resetForm()" style="margin-top:var(--space-4);">
            Book Another Appointment
          </button>
        </div>
      `;
    }
  },

  resetForm() {
    // Re-render the appointment page
    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = Pages.appointment();
      Components.initScrollReveal();
      this.init();
      this.switchTab('form');
    }
  },

  /* --- Voice Input (Web Speech API) --- */
  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-IN';

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById('chat-input');
      if (input) {
        input.value = transcript;
      }
      this.stopListening();
    };

    this.recognition.onerror = () => {
      this.stopListening();
    };

    this.recognition.onend = () => {
      this.stopListening();
    };
  },

  toggleVoice() {
    if (!this.recognition) {
      alert('Voice input is not supported in your browser. Please use Chrome for the best experience.');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.stopListening();
    } else {
      const consent = confirm(
        'Medifort Wellness Voice Input\n\n' +
        'Your voice will be processed by your browser\'s built-in speech recognition. ' +
        'No audio data is sent to Medifort servers.\n\n' +
        'Click OK to enable voice input.'
      );
      if (consent) {
        this.startListening();
      }
    }
  },

  startListening() {
    this.isListening = true;
    const micBtn = document.getElementById('chat-mic-btn');
    if (micBtn) micBtn.classList.add('listening');
    try {
      this.recognition.start();
    } catch (e) {
      this.stopListening();
    }
  },

  stopListening() {
    this.isListening = false;
    const micBtn = document.getElementById('chat-mic-btn');
    if (micBtn) micBtn.classList.remove('listening');
  }
};
