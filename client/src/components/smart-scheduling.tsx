import React, { useEffect } from 'react';

export default function SmartScheduling() {
  useEffect(() => {
    // This effect will run once when the component mounts
    const container = document.getElementById('scheduling-container');
    if (container) {
      container.innerHTML = `
        <div class="container">
          <div class="header">
              <h1>🏥 Agenda</h1>
              <p>Agende sua consulta de forma rápida e fácil</p>
          </div>

          <div class="main-content">
              <div class="sidebar">
                  <div class="form-group">
                      <label for="profissional">Selecione o Profissional:</label>
                      <select id="profissional" class="form-select">
                          <option value="">Escolha um profissional...</option>
                          <option value="daniel">Daniel - Dermato</option>
                          <option value="george">George - Clínico Geral</option>
                          <option value="maria">Maria - Ginecologista</option>
                          <option value="antonio">Antonio - Cirurgião</option>
                          <option value="renata">Renata - Dermato</option>
                      </select>
                  </div>

                  <div class="professional-info" id="professionalInfo" style="display: none;">
                      <h4>📋 Informações do Profissional</h4>
                      <div class="schedule-info" id="scheduleInfo"></div>
                  </div>

                  <button class="confirm-button" id="confirmButton" disabled>
                      📅 Confirmar Agendamento
                  </button>

                  <div class="status-message" id="statusMessage" style="display: none;"></div>
              </div>

              <div class="calendar-section">
                  <div class="calendar-header">
                      <button class="calendar-nav" id="prevMonth">‹</button>
                      <div class="calendar-title" id="calendarTitle">Junho 2025</div>
                      <button class="calendar-nav" id="nextMonth">›</button>
                  </div>

                  <div class="calendar-grid" id="calendarGrid">
                      <div class="calendar-day-header">Dom</div>
                      <div class="calendar-day-header">Seg</div>
                      <div class="calendar-day-header">Ter</div>
                      <div class="calendar-day-header">Qua</div>
                      <div class="calendar-day-header">Qui</div>
                      <div class="calendar-day-header">Sex</div>
                      <div class="calendar-day-header">Sáb</div>
                  </div>

                  <div class="time-slots" id="timeSlots" style="display: none;"></div>
              </div>
          </div>
        </div>
      `;

      // Dados simulados dos profissionais
      const profissionais = {
          daniel: {
              nome: "Daniel - Dermato",
              atendimentos: `🕒 Dias e Horários de Atendimento - para uso interno do sistema de marcação
Segunda: 8h:00 às 13h00
Terça: 14h:00 às 18h00
Quarta: ❌ Agenda Fechada
Quinta: ❌ Agenda Fechada
Sexta: ❌ Agenda Fechada
Sábado: 9h00 às 13h00
Domingo: ❌ Fechado
Duração da Consulta: 60 Minutos (Obrigatório)
Intervalo entre Pacientes para atendimento: 5 minutos
intervalo para o almoço: 12 às 13h00`
          },
          george: {
              nome: "George - Clínico Geral",
              atendimentos: `🕒 Dias e Horários de Atendimento - para uso interno do sistema de marcação
Segunda: 7h:00 às 12h00
Terça: 7h:00 às 12h00
Quarta: 14h:00 às 18h00
Quinta: 14h:00 às 18h00
Sexta: 7h:00 às 12h00
Sábado: ❌ Agenda Fechada
Domingo: ❌ Fechado
Duração da Consulta: 30 Minutos (Obrigatório)
Intervalo entre Pacientes para atendimento: 10 minutos
intervalo para o almoço: ❌`
          },
          maria: {
              nome: "Maria - Ginecologista",
              atendimentos: `🕒 Dias e Horários de Atendimento - para uso interno do sistema de marcação
Segunda: 8h:00 às 17h00
Terça: 8h:00 às 17h00
Quarta: 8h:00 às 17h00
Quinta: 8h:00 às 17h00
Sexta: 8h:00 às 12h00
Sábado: ❌ Agenda Fechada
Domingo: ❌ Fechado
Duração da Consulta: 45 Minutos (Obrigatório)
Intervalo entre Pacientes para atendimento: 15 minutos
intervalo para o almoço: 12 às 14h00`
          }
      };

      let currentDate = new Date();
      let selectedProfessional = null;
      let selectedDate = null;
      let selectedTime = null;
      let professionalSchedule = null;

      // Elementos DOM
      const profissionalSelect = document.getElementById('profissional');
      const professionalInfo = document.getElementById('professionalInfo');
      const scheduleInfo = document.getElementById('scheduleInfo');
      const calendarGrid = document.getElementById('calendarGrid');
      const calendarTitle = document.getElementById('calendarTitle');
      const timeSlots = document.getElementById('timeSlots');
      const confirmButton = document.getElementById('confirmButton');
      const statusMessage = document.getElementById('statusMessage');
      const prevMonthBtn = document.getElementById('prevMonth');
      const nextMonthBtn = document.getElementById('nextMonth');

      // Parser do campo atendimentos
      function parseAtendimentos(atendimentosText) {
          const lines = atendimentosText.split('\n');
          const schedule = {
              days: {},
              duration: 60,
              interval: 5,
              lunch: null
          };

          lines.forEach(line => {
              line = line.trim();
              
              // Parse dias da semana
              const dayMatch = line.match(/^(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo):\s*(.+)$/);
              if (dayMatch) {
                  const day = dayMatch[1];
                  const hours = dayMatch[2];
                  
                  if (hours.includes('❌') || hours.includes('Fechad')) {
                      schedule.days[day] = null;
                  } else {
                      const timeMatch = hours.match(/(\d+)h?:?(\d+)?\s*às?\s*(\d+)h?:?(\d+)?/);
                      if (timeMatch) {
                          const startHour = parseInt(timeMatch[1]);
                          const startMin = parseInt(timeMatch[2] || 0);
                          const endHour = parseInt(timeMatch[3]);
                          const endMin = parseInt(timeMatch[4] || 0);
                          
                          schedule.days[day] = {
                              start: { hour: startHour, minute: startMin },
                              end: { hour: endHour, minute: endMin }
                          };
                      }
                  }
              }
              
              // Parse duração da consulta
              if (line.includes('Duração da Consulta')) {
                  const durationMatch = line.match(/(\d+)\s*Minutos/);
                  if (durationMatch) {
                      schedule.duration = parseInt(durationMatch[1]);
                  }
              }
              
              // Parse intervalo entre pacientes
              if (line.includes('Intervalo entre Pacientes')) {
                  const intervalMatch = line.match(/(\d+)\s*minutos/);
                  if (intervalMatch) {
                      schedule.interval = parseInt(intervalMatch[1]);
                  }
              }
              
              // Parse intervalo de almoço
              if (line.includes('intervalo para o almoço') && !line.includes('❌')) {
                  const lunchMatch = line.match(/(\d+)\s*às?\s*(\d+)h?:?(\d+)?/);
                  if (lunchMatch) {
                      schedule.lunch = {
                          start: { hour: parseInt(lunchMatch[1]), minute: 0 },
                          end: { hour: parseInt(lunchMatch[2]), minute: parseInt(lunchMatch[3] || 0) }
                      };
                  }
              }
          });

          return schedule;
      }

      // Gerar slots de horário - VERSÃO CORRIGIDA
      function generateTimeSlots(date, schedule) {
          const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
          const dayName = dayNames[date.getDay()];
          
          if (!schedule.days[dayName]) {
              return [];
          }

          const daySchedule = schedule.days[dayName];
          const slots = [];
          
          // Converter horários de início e fim para minutos para facilitar cálculos
          const startMinutes = daySchedule.start.hour * 60 + daySchedule.start.minute;
          const endMinutes = daySchedule.end.hour * 60 + daySchedule.end.minute;
          
          // Duração total de um slot (consulta + intervalo)
          const slotDuration = schedule.duration + schedule.interval;
          
          // Calcular quantos slots completos cabem no período
          // O último slot deve terminar antes ou exatamente no horário de fim
          // Portanto, o último slot pode começar no máximo em (endMinutes - schedule.duration)
          const maxStartMinute = endMinutes - schedule.duration;
          
          // Gerar slots
          for (let currentMinute = startMinutes; currentMinute <= maxStartMinute; currentMinute += slotDuration) {
              // Converter minutos de volta para hora e minuto
              const currentHour = Math.floor(currentMinute / 60);
              const currentMin = currentMinute % 60;
              
              // Criar objeto de data para o horário do slot
              const slotTime = new Date(date);
              slotTime.setHours(currentHour, currentMin, 0, 0);
              
              // Verificar se o slot conflita com o horário de almoço
              let conflictsWithLunch = false;
              if (schedule.lunch) {
                  const lunchStartMinutes = schedule.lunch.start.hour * 60 + schedule.lunch.start.minute;
                  const lunchEndMinutes = schedule.lunch.end.hour * 60 + schedule.lunch.end.minute;
                  
                  // O slot conflita se começar antes do fim do almoço e terminar depois do início do almoço
                  const slotEndMinute = currentMinute + schedule.duration;
                  if (currentMinute < lunchEndMinutes && slotEndMinute > lunchStartMinutes) {
                      conflictsWithLunch = true;
                  }
              }
              
              if (!conflictsWithLunch) {
                  slots.push({
                      time: slotTime,
                      available: Math.random() > 0.3 // Simula disponibilidade
                  });
              }
          }
          
          return slots;
      }

      // Event Listeners
      if (profissionalSelect) {
        profissionalSelect.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            
            if (selectedValue && profissionais[selectedValue]) {
                selectedProfessional = selectedValue;
                professionalSchedule = parseAtendimentos(profissionais[selectedValue].atendimentos);
                
                // Mostrar informações do profissional
                professionalInfo.style.display = 'block';
                scheduleInfo.innerHTML = profissionais[selectedValue].atendimentos.replace(/\n/g, '<br>');
                
                // Atualizar calendário
                renderCalendar();
                
                // Limpar seleções
                selectedDate = null;
                selectedTime = null;
                timeSlots.style.display = 'none';
                updateConfirmButton();
            } else {
                professionalInfo.style.display = 'none';
                selectedProfessional = null;
                professionalSchedule = null;
                renderCalendar();
                timeSlots.style.display = 'none';
                updateConfirmButton();
            }
        });
      }

      // Navegação do calendário
      if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
      }

      if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
      }

      // Confirmar agendamento
      if (confirmButton) {
        confirmButton.addEventListener('click', () => {
            if (selectedProfessional && selectedDate && selectedTime) {
                showStatusMessage(`✅ Agendamento confirmado para ${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})} com ${profissionais[selectedProfessional].nome}`, 'success');
                
                // Reset
                selectedDate = null;
                selectedTime = null;
                timeSlots.style.display = 'none';
                renderCalendar();
                updateConfirmButton();
            }
        });
      }

      // Renderizar calendário
      function renderCalendar() {
          if (!calendarGrid || !calendarTitle) return;
          
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          
          // Atualizar título
          const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
          calendarTitle.textContent = `${monthNames[month]} ${year}`;
          
          // Limpar grid
          const existingDays = calendarGrid.querySelectorAll('.calendar-day');
          existingDays.forEach(day => day.remove());
          
          // Primeiro dia do mês e último dia
          const firstDay = new Date(year, month, 1);
          const lastDay = new Date(year, month + 1, 0);
          const startCalendar = new Date(firstDay);
          startCalendar.setDate(startCalendar.getDate() - firstDay.getDay());
          
          // Renderizar dias
          for (let i = 0; i < 42; i++) {
              const date = new Date(startCalendar);
              date.setDate(startCalendar.getDate() + i);
              
              const dayElement = document.createElement('div');
              dayElement.className = 'calendar-day';
              dayElement.textContent = date.getDate();
              
              // Classificar tipo de dia
              if (date.getMonth() !== month) {
                  dayElement.classList.add('other-month');
              } else if (isPastDate(date)) {
                  // Datas passadas sempre bloqueadas, independente do profissional
                  dayElement.classList.add('past');
              } else if (date.toDateString() === new Date().toDateString()) {
                  // Hoje: verificar se profissional atende
                  if (professionalSchedule && isDayAvailable(date)) {
                      dayElement.classList.add('today');
                      dayElement.addEventListener('click', () => selectDate(date));
                  } else if (professionalSchedule) {
                      dayElement.classList.add('today');
                      dayElement.style.opacity = '0.5';
                  } else {
                      dayElement.classList.add('today');
                  }
              } else if (professionalSchedule && isDayAvailable(date)) {
                  // Datas futuras disponíveis
                  dayElement.classList.add('available');
                  dayElement.addEventListener('click', () => selectDate(date));
              } else if (professionalSchedule) {
                  // Datas futuras indisponíveis (profissional não atende)
                  dayElement.classList.add('unavailable');
              }
              
              if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                  dayElement.classList.add('selected');
              }
              
              calendarGrid.appendChild(dayElement);
          }
      }

      // Verificar se o dia está disponível
      function isDayAvailable(date) {
          if (!professionalSchedule) return false;
          
          // Bloquear datas passadas
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const checkingDate = new Date(date);
          checkingDate.setHours(0, 0, 0, 0);
          
          if (checkingDate < today) {
              return false;
          }
          
          const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
          const dayName = dayNames[date.getDay()];
          
          return professionalSchedule.days[dayName] !== null && professionalSchedule.days[dayName] !== undefined;
      }

      // Verificar se a data é passada
      function isPastDate(date) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const checkingDate = new Date(date);
          checkingDate.setHours(0, 0, 0, 0);
          
          return checkingDate < today;
      }

      // Selecionar data
      function selectDate(date) {
          selectedDate = date;
          selectedTime = null;
          renderCalendar();
          renderTimeSlots(date);
          updateConfirmButton();
      }

      // Renderizar slots de horário
      function renderTimeSlots(date) {
          if (!timeSlots) return;
          
          const slots = generateTimeSlots(date, professionalSchedule);
          timeSlots.innerHTML = '';
          
          if (slots.length === 0) {
              timeSlots.innerHTML = '<div class="status-message info">Nenhum horário disponível para este dia.</div>';
              timeSlots.style.display = 'block';
              return;
          }
          
          slots.forEach(slot => {
              const slotElement = document.createElement('div');
              slotElement.className = 'time-slot';
              slotElement.textContent = slot.time.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
              
              if (slot.available) {
                  slotElement.classList.add('available');
                  slotElement.addEventListener('click', () => selectTime(slot.time, slotElement));
              } else {
                  slotElement.classList.add('occupied');
              }
              
              timeSlots.appendChild(slotElement);
          });
          
          timeSlots.style.display = 'grid';
      }

      // Selecionar horário
      function selectTime(time, element) {
          // Remover seleção anterior
          document.querySelectorAll('.time-slot.selected').forEach(slot => {
              slot.classList.remove('selected');
          });
          
          selectedTime = time;
          element.classList.add('selected');
          updateConfirmButton();
      }

      // Atualizar botão de confirmação
      function updateConfirmButton() {
          if (!confirmButton) return;
          confirmButton.disabled = !(selectedProfessional && selectedDate && selectedTime);
      }

      // Mostrar mensagem de status
      function showStatusMessage(message, type) {
          if (!statusMessage) return;
          statusMessage.textContent = message;
          statusMessage.className = `status-message ${type}`;
          statusMessage.style.display = 'block';
          
          setTimeout(() => {
              statusMessage.style.display = 'none';
          }, 5000);
      }

      // Inicializar
      renderCalendar();
    }
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Agenda Semanal
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualização completa dos agendamentos da semana
        </p>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 1.1rem;
        }

        .main-content {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
            padding: 30px;
        }

        .sidebar {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            height: fit-content;
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #2c3e50;
            font-size: 1.1rem;
        }

        .form-select {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 1rem;
            background: white;
            transition: all 0.3s ease;
        }

        .form-select:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .professional-info {
            background: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #e9ecef;
            margin-top: 15px;
        }

        .professional-info h4 {
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .schedule-info {
            font-size: 0.9rem;
            line-height: 1.6;
            color: #666;
        }

        .calendar-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
        }

        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .calendar-nav {
            background: #3498db;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }

        .calendar-nav:hover {
            background: #2980b9;
            transform: scale(1.1);
        }

        .calendar-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2c3e50;
        }

        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
            margin-bottom: 20px;
        }

        .calendar-day-header {
            text-align: center;
            font-weight: 600;
            color: #666;
            padding: 10px;
            font-size: 0.9rem;
        }

        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            font-weight: 500;
        }

        .calendar-day.available {
            background: #e8f5e8;
            color: #27ae60;
            border: 2px solid #27ae60;
        }

        .calendar-day.available:hover {
            background: #27ae60;
            color: white;
            transform: scale(1.05);
        }

        .calendar-day.unavailable {
            background: #ffebee;
            color: #e74c3c;
            border: 2px solid #e74c3c;
            cursor: not-allowed;
        }

        .calendar-day.past {
            background: #ffebee;
            color: #e74c3c;
            border: 2px solid #e74c3c;
            cursor: not-allowed;
            opacity: 0.7;
        }

        .calendar-day.other-month {
            background: #f5f5f5;
            color: #bbb;
            cursor: not-allowed;
        }

        .calendar-day.today {
            background: #3498db;
            color: white;
            font-weight: bold;
        }

        .calendar-day.selected {
            background: #8e44ad !important;
            color: white;
            transform: scale(1.1);
        }

        .time-slots {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin-top: 20px;
        }

        .time-slot {
            padding: 12px 15px;
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        .time-slot.available {
            border-color: #27ae60;
            color: #27ae60;
        }

        .time-slot.available:hover {
            background: #27ae60;
            color: white;
        }

        .time-slot.occupied {
            background: #ffebee;
            border-color: #e74c3c;
            color: #e74c3c;
            cursor: not-allowed;
        }

        .time-slot.selected {
            background: #8e44ad;
            border-color: #8e44ad;
            color: white;
        }

        .confirm-button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s ease;
        }

        .confirm-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
        }

        .confirm-button:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .status-message {
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: center;
            font-weight: 500;
        }

        .status-message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .status-message.info {
            background: #cce7ff;
            color: #004085;
            border: 1px solid #99d3ff;
        }

        @media (max-width: 768px) {
            .main-content {
                grid-template-columns: 1fr;
                gap: 20px;
                padding: 20px;
            }
            
            .calendar-day {
                font-size: 0.9rem;
            }
            
            .time-slots {
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            }
        }

        .loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }

        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
      `}} />
      
      <div id="scheduling-container"></div>
    </div>
  );
}