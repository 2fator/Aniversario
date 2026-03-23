/**
 * Sistema Escolar de Aniversários
 * Gerencia cadastro e verificação de datas via LocalStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('student-form');
    const nameInput = document.getElementById('student-name');
    const classInput = document.getElementById('student-class');
    const dateInput = document.getElementById('student-dob');
    const listContainer = document.getElementById('student-list');
    const birthdayContainer = document.getElementById('birthday-list');
    const birthdaySection = document.getElementById('birthday-section');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    const searchInput = document.getElementById('search-input');

    const STORAGE_KEY = 'school_birthday_system_db';

    // 1. Carregar dados iniciais
    let students = loadStudents();
    renderAll();

    // 2. Evento de Adicionar
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addStudent();
    });

    // 3. Evento de Exportar CSV
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }

    // 4. Evento de Importar CSV
    if (importBtn && importFile) {
        importBtn.addEventListener('click', () => importFile.click());
        importFile.addEventListener('change', importFromCSV);
    }

    // 5. Evento de Pesquisa
    if (searchInput) {
        searchInput.addEventListener('input', renderAll);
    }

    // 6. PWA: Registrar Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('PWA Service Worker registrado com sucesso!'))
            .catch(err => console.error('Erro ao registrar PWA:', err));
    }

    // --- FUNÇÕES PRINCIPAIS ---

    function importFromCSV(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const lines = text.split('\n');
            let importedCount = 0;

            lines.forEach((line, index) => {
                // Pular cabeçalho ou linhas vazias
                if (index === 0 && line.toLowerCase().includes('nome')) return;
                if (!line.trim()) return;

                const parts = line.split(',');
                // Esperado: Nome, Turma, Data (DD/MM/AAAA)
                // Suporta também apenas: Nome, Data
                
                let name, studentClass, dobString;

                if (parts.length >= 3) {
                    name = parts[0].trim();
                    studentClass = parts[1].trim();
                    dobString = parts[2].trim();
                } else if (parts.length === 2) {
                    name = parts[0].trim();
                    studentClass = '';
                    dobString = parts[1].trim();
                } else {
                    return;
                }

                // Converter DD/MM/AAAA para AAAA-MM-DD
                const dateParts = dobString.split('/');
                if (dateParts.length === 3) {
                    let d, m, y;
                    // Tentar detectar formato (se ano é o primeiro ou ultimo)
                    if (dateParts[2].length === 4) {
                        // Formato DD/MM/AAAA
                        [d, m, y] = dateParts;
                    } else if (dateParts[0].length === 4) {
                        // Formato AAAA/MM/DD (caso venha de algum sistema assim)
                        [y, m, d] = dateParts;
                    } else {
                        return; // Formato desconhecido, ignora
                    }

                    // Validação simples
                    if (y.length === 4 && m.length <= 2 && d.length <= 2) {
                        const formattedDob = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                        
                        students.push({
                            id: Date.now() + Math.random(), // Evita colisão de IDs no loop
                            name: name,
                            dob: formattedDob,
                            studentClass: studentClass
                        });
                        importedCount++;
                    }
                }
            });

            if (importedCount > 0) {
                saveStudents();
                renderAll();
                alert(`${importedCount} alunos importados com sucesso!`);
            } else {
                alert('Nenhum aluno válido encontrado ou formato incorreto.');
            }
            // Limpar input para permitir importar o mesmo arquivo novamente se necessário
            event.target.value = '';
        };
        reader.readAsText(file);
    }

    function exportToCSV() {
        if (students.length === 0) {
            alert("Não há alunos para exportar.");
            return;
        }

        // Cabeçalho do CSV
        let csvContent = "Nome,Turma,Data de Nascimento\n";

        // Linhas
        students.forEach(student => {
            const [y, m, d] = student.dob.split('-');
            const formattedDate = `${d}/${m}/${y}`;
            const sClass = student.studentClass || ''; // Garante que não quebre se for vazio
            csvContent += `${student.name},${sClass},${formattedDate}\n`;
        });

        // Criar Blob e Link de Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'alunos_aniversarios.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function addStudent() {
        const name = nameInput.value.trim();
        const dob = dateInput.value; // Formato YYYY-MM-DD
        const studentClass = classInput ? classInput.value.trim() : '';

        if (!name || !dob) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Validar se data não é futura
        if (new Date(dob) > new Date()) {
            alert('A data de nascimento não pode ser no futuro!');
            return;
        }

        const newStudent = {
            id: Date.now(), // ID único baseado em timestamp
            name: name,
            dob: dob,
            studentClass: studentClass
        };

        students.push(newStudent);
        saveStudents();
        renderAll();
        
        // Limpar formulário
        form.reset();
        nameInput.focus();
    }

    function removeStudent(id) {
        if(confirm('Tem certeza que deseja remover este aluno?')) {
            students = students.filter(student => student.id !== id);
            saveStudents();
            renderAll();
        }
    }

    // Salvar no LocalStorage
    function saveStudents() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    }

    // Carregar do LocalStorage
    function loadStudents() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    // --- LÓGICA DE RENDERIZAÇÃO ---

    function renderAll() {
        // Limpar listas atuais
        listContainer.innerHTML = '';
        birthdayContainer.innerHTML = '';

        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1; // JS conta meses de 0 a 11

        let hasBirthdayToday = false;
        // Obter termo de pesquisa
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        // Ordenar: Aniversariantes do mês atual no topo (por dia), restantes por nome
        students.sort((a, b) => {
            // Proteção para dados válidos
            const partsA = a.dob ? a.dob.split('-') : [];
            const partsB = b.dob ? b.dob.split('-') : [];

            if (partsA.length !== 3) return 1;
            if (partsB.length !== 3) return -1;

            const mA = Number(partsA[1]);
            const dA = Number(partsA[2]);
            const mB = Number(partsB[1]);
            const dB = Number(partsB[2]);

            const isCurrentA = (mA === currentMonth);
            const isCurrentB = (mB === currentMonth);

            if (isCurrentA && !isCurrentB) return -1; // A vem primeiro
            if (!isCurrentA && isCurrentB) return 1;  // B vem primeiro
            if (isCurrentA && isCurrentB) return dA - dB; // Ambos do mês: ordena pelo dia

            return a.name.localeCompare(b.name); // Restante: alfabético
        });

        students.forEach(student => {
            // Calcular componentes da data do aluno
            // Importante: Usamos split para evitar problemas de fuso horário do objeto Date
            const [y, m, d] = student.dob.split('-').map(Number);
            
            const isBirthday = (d === currentDay && m === currentMonth);
            const isCurrentMonth = (m === currentMonth);
            
            // Criar elemento HTML
            const card = createStudentCard(student, isBirthday, false, isCurrentMonth);

            // Adicionar à lista geral (apenas se corresponder à pesquisa)
            if (student.name.toLowerCase().includes(searchTerm)) {
                listContainer.appendChild(card);
            }

            // Se for aniversário, criar um clone ou cartão especial para a seção de destaque
            if (isBirthday) {
                hasBirthdayToday = true;
                const highlightCard = createStudentCard(student, true, true);
                birthdayContainer.appendChild(highlightCard);
            }
        });

        // Mostrar ou esconder a seção de destaque
        if (hasBirthdayToday) {
            birthdaySection.classList.remove('hidden');
        } else {
            birthdaySection.classList.add('hidden');
        }
    }

    function createStudentCard(student, isBirthday, isHighlightSection = false, isCurrentMonth = false) {
        const div = document.createElement('div');
        div.className = 'student-item';

        // Formatar data para exibição (DD/MM/YYYY)
        // Validação preventiva para evitar erros de cálculo (NaN)
        const dateParts = student.dob ? student.dob.split('-') : [];
        
        if (dateParts.length !== 3) {
            div.innerHTML = `<div class="student-info"><h3>${student.name}</h3><span style="color:red">Data Inválida</span></div>`;
            // Adiciona botão de delete mesmo se inválido para permitir limpeza
            addDeleteButton(div, student.id);
            return div;
        }

        const [year, month, day] = dateParts.map(Number);
        const formattedDate = `${day}/${month}/${year}`;
        
        // Adicionar classe de destaque se for do mês atual
        if (isCurrentMonth && !isHighlightSection) {
            div.classList.add('current-month');
        }

        // Cálculos de Idade
        const today = new Date();
        const currentYear = today.getFullYear();
        
        // Idade que vai fazer este ano (Ano atual - Ano nasc)
        const turningAge = currentYear - year;
        
        // Idade Real Atual (cálculo preciso)
        let realAge = turningAge;
        const m = today.getMonth() + 1 - month;
        if (m < 0 || (m === 0 && today.getDate() < day)) {
            realAge--;
        }

        // Proteção extra se o cálculo resultar em NaN
        const displayAge = isNaN(realAge) ? '?' : realAge;

        // Info da Turma
        const classInfo = student.studentClass ? ` | Turma: <strong>${student.studentClass}</strong>` : '';

        // Badge do Mês (Aparece se for mês atual, mas não hoje, e não for a seção de destaque)
        const monthBadge = (isCurrentMonth && !isBirthday && !isHighlightSection) 
            ? '<span class="month-badge"><span class="material-icons-round" style="font-size:12px">calendar_today</span> Este mês</span>' 
            : '';

        // Formatar texto da idade para singular/plural e caso 0
        let ageDisplay;
        if (turningAge === 0) ageDisplay = "Menos de 1 ano";
        else if (turningAge === 1) ageDisplay = "1 ano";
        else ageDisplay = `${turningAge} anos`;

        let realAgeDisplay = isNaN(realAge) ? '?' : (realAge === 0 ? '0' : realAge);

        // Texto de aniversário
        const birthdayText = isHighlightSection 
            ? (turningAge === 0 ? `🎂 <strong>Nasceu hoje!</strong> (Recém-nascido)` : `🎂 Fazendo <strong>${ageDisplay}</strong>!`) 
            : (isBirthday ? `🎁 <strong>Hoje!</strong> (${ageDisplay})` : `Idade: ${realAgeDisplay} anos • ${formattedDate}`);

        div.innerHTML = `
            <div class="student-info">
                <h3>${student.name} ${classInfo} ${monthBadge}</h3>
                <span>${birthdayText}</span>
            </div>
            <button class="delete-btn" aria-label="Remover aluno">
                <span class="material-icons-round">delete</span>
            </button>
        `;

        addDeleteButton(div, student.id);
        return div;
    }

    function addDeleteButton(element, id) {
        // Adicionar evento de delete
        // Nota: Se estiver na seção de destaque, talvez não queiramos o botão de delete,
        // mas deixei funcional para consistência.
        const deleteBtn = element.querySelector('.delete-btn');
        if(deleteBtn) {
            deleteBtn.addEventListener('click', () => removeStudent(id));
        }
    }
});

/* 
    DICA: Para testar, adicione um aluno com a data de hoje!
    O LocalStorage persiste os dados mesmo se fechar o navegador.
*/