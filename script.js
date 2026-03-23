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
    const clearBtn = document.getElementById('clear-btn');
    const searchInput = document.getElementById('search-input');
    const installPwaBtn = document.getElementById('install-pwa-btn');

    const STORAGE_KEY = 'school_birthday_system_db';
    let deferredPrompt; // Variável para guardar o evento de instalação

    // Aviso se estiver rodando via arquivo local (file://)
    if (window.location.protocol === 'file:') {
        console.warn("Atenção: A instalação do PWA (App) não funciona via protocolo 'file://'. Use um servidor local (localhost) ou hospede o site.");
    }

    // --- DADOS INICIAIS (PRE-POPULADOS) ---
    const INITIAL_DATA = [
        { name: "ADONAY JOSÉ DA SILVA PINHEIRO", studentClass: "301", dob: "2009-07-21" },
        { name: "ADRIANA FERREIRA DA SILVA", studentClass: "202", dob: "2008-08-21" },
        { name: "ADRIANA FERREIRA DA SILVA", studentClass: "101", dob: "2011-12-24" },
        { name: "ADRIANNY REIS SILVA", studentClass: "201", dob: "2010-09-29" },
        { name: "ALAN KARDERCK MOREIRA DINIZ", studentClass: "301", dob: "2008-06-21" },
        { name: "ALAN KARDERCK PEREIRA FONSECA", studentClass: "202", dob: "2009-10-07" },
        { name: "ALAN KARDERCK PEREIRA FONSECA", studentClass: "100", dob: "2011-12-30" },
        { name: "ANA BEATRIZ CARVALHO PEREIRA", studentClass: "101", dob: "2010-11-21" },
        { name: "ANA BEATRIZ LIMA SANTOS", studentClass: "100", dob: "2011-02-04" },
        { name: "ANA BEATRIZ PEREIRA SILVA", studentClass: "101", dob: "2010-12-26" },
        { name: "ANA BEATRIZ SILVA ARAÚJO", studentClass: "101", dob: "2010-11-27" },
        { name: "ANA CLARA PEREIRA DINIZ", studentClass: "101", dob: "2011-12-14" },
        { name: "ANA JULIA COSTA CUTRIM", studentClass: "301", dob: "2008-08-16" },
        { name: "ANA JULIA DINIZ DOS SANTOS", studentClass: "301", dob: "2008-03-10" },
        { name: "ANA JULIA MELONIO DE SOUSA", studentClass: "101", dob: "2011-08-24" },
        { name: "ANA JULIA MENDES FONSECA", studentClass: "101", dob: "2010-11-24" },
        { name: "ANA JULIA MOTA PEREIRA", studentClass: "100", dob: "2010-05-10" },
        { name: "ANA JULIA PEREIRA MELONIO", studentClass: "101", dob: "2011-10-04" },
        { name: "ANNA JÚLIA PEREIRA SANTOS", studentClass: "202", dob: "2009-09-12" },
        { name: "ANNE GABRIELLY SILVA FONSECA", studentClass: "202", dob: "2010-07-30" },
        { name: "BRENDA KEROLYNE SILVA PENHA", studentClass: "100", dob: "2011-03-07" },
        { name: "CARLOS DANIEL ARAÚJO DINIZ", studentClass: "101", dob: "2010-12-02" },
        { name: "CARLOS DANIEL SOARES RODRIGUES", studentClass: "201", dob: "2009-08-11" },
        { name: "CARLOS EDUARDO ALMEIDA FERREIRA", studentClass: "201", dob: "2010-05-21" },
        { name: "CARLOS EDUARDO ARAÚJO PINHEIRO", studentClass: "202", dob: "2009-10-06" },
        { name: "CARLOS EDUARDO FONSECA SILVA", studentClass: "301", dob: "2009-08-10" },
        { name: "CARLOS EDUARDO SILVA MELONIO", studentClass: "100", dob: "2011-03-18" },
        { name: "CLARA VITORIA DOS SANTOS PENHA", studentClass: "201", dob: "2010-03-30" },
        { name: "DAVI LUCAS DE SOUSA PEREIRA", studentClass: "100", dob: "2010-12-23" },
        { name: "DAVI LUCAS DOS SANTOS DINIZ", studentClass: "202", dob: "2009-02-15" },
        { name: "DAVI LUCAS DOS SANTOS OLIVEIRA", studentClass: "201", dob: "2009-06-09" },
        { name: "DAVI LUCAS MENDES DINIZ", studentClass: "201", dob: "2008-07-15" },
        { name: "DAVI LUCAS PEREIRA OLIVEIRA", studentClass: "201", dob: "2008-03-07" },
        { name: "DAVI LUCAS SILVA COSTA", studentClass: "201", dob: "2010-04-23" },
        { name: "DAVI LUCAS SILVA DOS SANTOS", studentClass: "100", dob: "2010-03-10" },
        { name: "DENISE MARCELE DE SOUZA PAIXÃO", studentClass: "202", dob: "2010-02-03" },
        { name: "DEYVID LUCAS SILVA CUTRIM", studentClass: "301", dob: "2009-09-16" },
        { name: "DEYVISON GABRIEL ARAÚJO MELONIO", studentClass: "100", dob: "2010-07-12" },
        { name: "DEYVISON GABRIEL RIBEIRO SILVA", studentClass: "101", dob: "2010-05-17" },
        { name: "DEYVISON GABRIEL SOARES MELONIO", studentClass: "100", dob: "2011-03-13" },
        { name: "ELEN CRISTINA DE SOUSA SILVA", studentClass: "100", dob: "2010-11-22" },
        { name: "ELEN CRISTINA SOARES SILVA", studentClass: "202", dob: "2009-02-26" },
        { name: "ELIDA CRISTINA CARVALHO PEREIRA", studentClass: "201", dob: "2010-06-26" },
        { name: "ELIDA CRISTINA CARVALHO PEREIRA", studentClass: "101", dob: "2011-12-25" },
        { name: "ELLEM VITORIA PINHEIRO CARVALHO", studentClass: "101", dob: "2011-08-04" },
        { name: "EMANUELA SILVA DINIZ", studentClass: "100", dob: "2010-09-22" },
        { name: "EMILLY GABRIELE SANTOS PINHEIRO", studentClass: "101", dob: "2010-12-06" },
        { name: "EMILLY GABRIELE SILVA MOREIRA", studentClass: "301", dob: "2009-09-23" },
        { name: "EMILLY VITORIA DE SOUSA SILVA", studentClass: "100", dob: "2011-06-11" },
        { name: "EMILLY VITÓRIA RIBEIRO VIEGAS", studentClass: "100", dob: "2011-07-14" },
        { name: "ESTER EMANUELA PEREIRA DE SOUSA", studentClass: "101", dob: "2011-05-14" },
        { name: "ESTHER SILVA COSTA", studentClass: "202", dob: "2010-03-26" },
        { name: "ESTHFANNY BHYANCA ARAÚJO LEITE", studentClass: "100", dob: "2010-10-28" },
        { name: "EVELYN VITÓRIA MORAES SILVA", studentClass: "201", dob: "2010-03-11" },
        { name: "FRANCIELLEN DINIZ DE SOUSA", studentClass: "201", dob: "2009-11-03" },
        { name: "GABRIEL DE SOUSA MOREIRA", studentClass: "100", dob: "2010-08-13" },
        { name: "GABRIELA CRISTINA MARTINS BARBOSA", studentClass: "201", dob: "2009-05-06" },
        { name: "GEOVANA BRUNA COELHO MARTINS", studentClass: "100", dob: "2009-11-15" },
        { name: "GRAZIELE CARVALHO MENDES", studentClass: "301", dob: "2008-03-12" },
        { name: "GRAZIELE CARVALHO MENDES", studentClass: "101", dob: "2011-11-25" },
        { name: "GUILHERME HENRIQUE PEREIRA CUTRIM", studentClass: "301", dob: "2009-02-06" },
        { name: "GUSTAVO HENRIQUE PEREIRA SILVA", studentClass: "100", dob: "2011-07-06" },
        { name: "GUSTAVO HENRIQUE SANTOS DINIZ", studentClass: "101", dob: "2010-09-28" },
        { name: "GUSTAVO HENRIQUE SILVA MORAES", studentClass: "202", dob: "2009-09-10" },
        { name: "GUYLHERME YAGO SOARES DOS SANTOS", studentClass: "301", dob: "2009-01-29" },
        { name: "ISADORA CRUZ MELO", studentClass: "101", dob: "2010-10-19" },
        { name: "ISADORA SILVA CARVALHO", studentClass: "201", dob: "2010-05-17" },
        { name: "ISIS RAPHAELLY MOTA SOARES", studentClass: "201", dob: "2009-02-02" },
        { name: "ISMAEL GOMES FERREIRA", studentClass: "301", dob: "2009-04-24" },
        { name: "IZABELLE MENDES FERNANDES SILVA", studentClass: "100", dob: "2010-11-03" },
        { name: "JAMILE VITÓRIA PINHEIRO FERREIRA", studentClass: "101", dob: "2011-06-11" },
        { name: "JAMILE VITÓRIA PINHEIRO FERREIRA", studentClass: "201", dob: "2009-12-22" },
        { name: "JAMILLY EMANUELE MENDES MELONIO", studentClass: "101", dob: "2010-11-12" },
        { name: "JAYLANA GABRIELE MOREIRA DE SOUSA", studentClass: "101", dob: "2011-04-17" },
        { name: "JAYLANE GABRIELE MORAES MENDES", studentClass: "201", dob: "2009-10-08" },
        { name: "JEFFERSON MARCELO PEREIRA NUNES", studentClass: "101", dob: "2011-01-28" },
        { name: "JOÃO CARLOS FONSECA SILVA", studentClass: "301", dob: "2007-12-11" },
        { name: "JOÃO CARLOS MENDES DOS SANTOS", studentClass: "100", dob: "2010-09-05" },
        { name: "JOÃO GABRIEL PEREIRA MARTINS", studentClass: "301", dob: "2009-10-01" },
        { name: "JOÃO GABRIEL PINHEIRO GOMES", studentClass: "100", dob: "2011-04-26" },
        { name: "JOÃO GABRIEL RIBEIRO", studentClass: "202", dob: "2009-07-25" },
        { name: "JOÃO GABRIEL SANTOS FONSECA", studentClass: "301", dob: "2009-11-26" },
        { name: "JOÃO GABRIEL SANTOS VIEGAS", studentClass: "100", dob: "2011-09-23" },
        { name: "JOÃO PEDRO DE SOUSA MARTINS", studentClass: "100", dob: "2011-06-20" },
        { name: "JOÃO PEDRO SOARES VIEGAS", studentClass: "202", dob: "2009-06-25" },
        { name: "JOSÉ AUGUSTO FONSECA COELHO", studentClass: "202", dob: "2009-06-04" },
        { name: "JOSÉ DE RIBAMAR MENDES PEREIRA NETO", studentClass: "301", dob: "2009-04-25" },
        { name: "JULIA CRISTINA PINHEIRO SILVA", studentClass: "201", dob: "2010-10-07" },
        { name: "JULIA SOFIA DE SOUZA SILVA", studentClass: "100", dob: "2011-11-26" },
        { name: "JULIA SOFIA LIMA CARDOSO", studentClass: "100", dob: "2010-11-14" },
        { name: "JULIANA SOARES DINIZ", studentClass: "301", dob: "2009-03-06" },
        { name: "JULIANA VICTORIA PINHEIRO FONSECA", studentClass: "202", dob: "2010-01-03" },
        { name: "JULIO CESAR MORAES SILVA", studentClass: "301", dob: "2009-06-15" },
        { name: "JULIO CESAR PINHEIRO SILVA", studentClass: "301", dob: "2008-04-22" },
        { name: "JULIO CESAR VIEGAS FERREIRA", studentClass: "101", dob: "2011-05-04" },
        { name: "JULIO CESAR VIEGAS FERREIRA", studentClass: "202", dob: "2009-12-31" },
        { name: "KAIQUE FERNANDO FERREIRA PEREIRA", studentClass: "202", dob: "2009-10-09" },
        { name: "KAIQUE FERNANDO MENDES PEREIRA", studentClass: "301", dob: "2009-12-15" },
        { name: "KAIQUE FERNANDO MENDES VIEGAS", studentClass: "201", dob: "2009-04-22" },
        { name: "KAIQUE GABRIEL MENDES OLIVEIRA", studentClass: "201", dob: "2010-08-23" },
        { name: "KAUÊ FERNANDO BARBOSA VIANA", studentClass: "301", dob: "2009-02-16" },
        { name: "KAYLANE REIS PEREIRA", studentClass: "101", dob: "2011-03-03" },
        { name: "KAYLANE VITÓRIA DE SOUSA SANTOS", studentClass: "201", dob: "2010-08-11" },
        { name: "KELVIN DE JESUS SILVA PENHA", studentClass: "101", dob: "2011-04-05" },
        { name: "LARYSSA VITORIA DE SOUSA PEREIRA", studentClass: "100", dob: "2011-04-23" },
        { name: "LAUANDERSON RIKELME FONSECA SOARES", studentClass: "202", dob: "2009-11-13" },
        { name: "LAYSA FARIAS DE QUEIROZ", studentClass: "101", dob: "2011-01-24" },
        { name: "LEYDIANE SILVA COSTA", studentClass: "201", dob: "2009-03-10" },
        { name: "LUAN FABRÍCIO CARVALHO PEREIRA", studentClass: "301", dob: "2009-05-07" },
        { name: "LUCAS PEREIRA SANTOS", studentClass: "301", dob: "2009-05-22" },
        { name: "LUCIANA CRISTINA DINIZ MELONIO", studentClass: "100", dob: "2011-12-20" },
        { name: "LUCIANA CRISTINA SANTOS PEREIRA", studentClass: "201", dob: "2009-09-05" },
        { name: "LUCIANA GABRIELE DINIZ MELONIO", studentClass: "202", dob: "2008-04-05" },
        { name: "LUCIENE GABRYELLE SILVA PEREIRA", studentClass: "201", dob: "2009-10-25" },
        { name: "LUDMILLA VITORIA DINIZ CUTRIM", studentClass: "100", dob: "2011-04-19" },
        { name: "LUIS DAVI PEREIRA DOS SANTOS", studentClass: "202", dob: "2010-03-05" },
        { name: "LUIS FERNANDO SILVA MOTA", studentClass: "100", dob: "2011-07-03" },
        { name: "LUIS GUILHERME DE SOUSA MARTINS", studentClass: "101", dob: "2011-06-06" },
        { name: "LUÍS EDUARDO SANTOS RIBEIRO", studentClass: "301", dob: "2009-02-19" },
        { name: "LUIZ FELIPE DE SOUSA DOS SANTOS", studentClass: "301", dob: "2009-02-20" },
        { name: "LUIZ FERNANDO RIBEIRO MOTA", studentClass: "301", dob: "2009-04-26" },
        { name: "LUIZ HENRIQUE RIBEIRO SILVA", studentClass: "301", dob: "2008-08-03" },
        { name: "MANUELLY BEZERRA DOS SANTOS", studentClass: "202", dob: "2009-11-10" },
        { name: "MARCELO GOMES GONÇALVES", studentClass: "202", dob: "2009-01-11" },
        { name: "MARCOS GABRIEL ARAÚJO MELONIO", studentClass: "100", dob: "2011-09-09" },
        { name: "MARCOS GABRIEL DINIZ DE SOUZA", studentClass: "101", dob: "2010-11-17" },
        { name: "MARCOS GABRIEL DINIZ MOTA", studentClass: "100", dob: "2011-11-17" },
        { name: "MARCOS PAULO SOUSA RIBEIRO", studentClass: "201", dob: "2009-04-14" },
        { name: "MARCOS PAULO SOUSA RIBEIRO", studentClass: "100", dob: "2010-09-04" },
        { name: "MARCOS VINICIUS MENDES DE SOUSA", studentClass: "301", dob: "2009-12-17" },
        { name: "MARCOS VINICIUS MONTEIRO VIEGAS", studentClass: "301", dob: "2007-11-03" },
        { name: "MARCOS VINICIUS PEREIRA DINIZ", studentClass: "101", dob: "2010-09-08" },
        { name: "MARCOS VINICIUS RIBEIRO DOS SANTOS", studentClass: "202", dob: "2009-10-12" },
        { name: "MARIA ALICE GOMES MELONIO", studentClass: "101", dob: "2011-04-30" },
        { name: "MARIA ALICE SILVA DINIZ", studentClass: "100", dob: "2011-11-19" },
        { name: "MARIA CLARA PEREIRA MELONIO", studentClass: "202", dob: "2010-02-27" },
        { name: "MARIA CLARA PEREIRA MENDES", studentClass: "201", dob: "2009-09-03" },
        { name: "MARIA EDUARDA DA SILVA PENHA", studentClass: "301", dob: "2009-01-11" },
        { name: "MARIA EDUARDA FONSECA PINHEIRO", studentClass: "100", dob: "2011-05-25" },
        { name: "MARIA EDUARDA MENDES", studentClass: "101", dob: "2011-04-17" },
        { name: "MARIA EDUARDA PINHEIRO DOS SANTOS", studentClass: "100", dob: "2011-11-27" },
        { name: "MARIA GABRYELA DINIZ FERREIRA", studentClass: "101", dob: "2010-03-19" },
        { name: "MARIA GABRYELA FONSECA PINHEIRO", studentClass: "301", dob: "2009-10-11" },
        { name: "MARIA HELOISA MENDES SILVA", studentClass: "202", dob: "2009-09-22" },
        { name: "MARIA HELOISA MENDES SILVA", studentClass: "101", dob: "2010-12-14" },
        { name: "MARIA JULIA FONSECA RIBEIRO", studentClass: "101", dob: "2011-03-25" },
        { name: "MARIA JÚLIA MENDES FONSECA", studentClass: "202", dob: "2010-07-13" },
        { name: "MARIANA VITORIA PAIXÃO MELONIO", studentClass: "101", dob: "2011-05-08" },
        { name: "MARIANA VITORIA PAIXÃO MELONIO", studentClass: "201", dob: "2009-12-27" },
        { name: "MARINA ALICE FONSECA PINHEIRO", studentClass: "101", dob: "2010-07-21" },
        { name: "MARINA EMANUELLE SILVA FERREIRA", studentClass: "202", dob: "2010-03-31" },
        { name: "MATHEUS FELIPE MORAES PEREIRA", studentClass: "202", dob: "2009-07-17" },
        { name: "MATHEUS HENRIQUE GOMES ARAÚJO", studentClass: "100", dob: "2010-09-05" },
        { name: "MATHEUS PEREIRA CARVALHO", studentClass: "101", dob: "2011-06-07" },
        { name: "MAYCON DOUGLAS SILVA DE SOUSA", studentClass: "201", dob: "2009-06-18" },
        { name: "MAYLON KAWAN FONSECA MARTINS", studentClass: "301", dob: "2009-10-01" },
        { name: "MAYRA EMANUELE PEREIRA RIBEIRO", studentClass: "201", dob: "2010-01-07" },
        { name: "MIKAELY PEREIRA MENDES", studentClass: "100", dob: "2011-01-15" },
        { name: "NATALIA SILVA CARDOSO", studentClass: "100", dob: "2010-08-21" },
        { name: "NICOLLE SANTOS FERREIRA", studentClass: "101", dob: "2010-10-16" },
        { name: "PABLO RAFAEL SILVA PEREIRA", studentClass: "202", dob: "2008-04-05" },
        { name: "PEDRO HENRIQUE MENDES SILVA", studentClass: "201", dob: "2009-03-14" },
        { name: "PEDRO HENRIQUE SILVA VIEGAS", studentClass: "100", dob: "2011-06-21" },
        { name: "PEDRO LUCAS MOREIRA FONSECA", studentClass: "101", dob: "2011-02-27" },
        { name: "PEDRO LUCAS SOUSA BRANDÃO", studentClass: "202", dob: "2010-02-09" },
        { name: "PHELIPE SOUSA OLIVEIRA", studentClass: "202", dob: "2008-10-23" },
        { name: "RAFAELA CARVALHO PEREIRA", studentClass: "301", dob: "2008-03-29" },
        { name: "RAYANNE VITÓRIA ARAÚJO DOS SANTOS", studentClass: "100", dob: "2011-04-15" },
        { name: "RAYSSA MARIA RIBEIRO DOS SANTOS", studentClass: "201", dob: "2010-05-13" },
        { name: "RYAN CARLOS SILVA CARVALHO", studentClass: "100", dob: "2011-03-04" },
        { name: "RYAN PEREIRA GOMES", studentClass: "201", dob: "2010-01-11" },
        { name: "SAMUEL FILIPE PEREIRA CARVALHO", studentClass: "101", dob: "2010-06-28" },
        { name: "SAMUEL PINHEIRO FONSECA", studentClass: "202", dob: "2009-09-13" },
        { name: "THALIA CAROLINE CASTRO FONSECA", studentClass: "101", dob: "2011-02-23" },
        { name: "THALIA GABRIELA MORAES DINIZ", studentClass: "301", dob: "2008-09-08" },
        { name: "THALIA GABRIELA MORAES DINIZ", studentClass: "101", dob: "2010-12-09" },
        { name: "THALITA DINIZ DE SOUZA", studentClass: "100", dob: "2010-08-26" },
        { name: "THALLYSON EMANUEL PEREIRA MENDES", studentClass: "202", dob: "2009-08-18" },
        { name: "WENDERSON REIS DINIZ", studentClass: "301", dob: "2008-11-12" },
        { name: "WESLLEY DE JESUS SANTOS PEREIRA", studentClass: "100", dob: "2011-03-19" },
        { name: "YASMIN GEOVANA MARTINS PEREIRA", studentClass: "201", dob: "2009-09-26" },
        { name: "YASMIM GEOVANA DOS SANTOS MENESES", studentClass: "201", dob: "2008-11-14" }
    ];

    // 1. Carregar dados iniciais
    let students = loadStudents();
    
    // Se não houver alunos, carregar dados iniciais (Seed)
    if (students.length === 0) {
        console.log("Banco de dados vazio. Carregando lista inicial de alunos...");
        students = INITIAL_DATA.map((s, index) => ({
            id: Date.now() + index, // Gera IDs únicos sequenciais
            name: s.name,
            dob: s.dob,
            studentClass: s.studentClass
        }));
        saveStudents();
    }

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
        importFile.addEventListener('change', handleFileImport);
    }

    // 5. Evento de Limpar Tudo
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllStudents);
    }

    // 6. Evento de Pesquisa
    if (searchInput) {
        searchInput.addEventListener('input', renderAll);
    }
    
    // 7. PWA: Lógica de Instalação
    window.addEventListener('beforeinstallprompt', (e) => {
        // Previne que o mini-infobar apareça no Chrome
        e.preventDefault();
        // Guarda o evento para que possa ser acionado mais tarde.
        deferredPrompt = e;
        // Mostra o nosso botão de instalação customizado
        if (installPwaBtn) {
            installPwaBtn.classList.remove('hidden');
            // Destaque visual para o botão quando disponível
            installPwaBtn.style.animation = "popIn 1s infinite alternate";
        }
    });

    if (installPwaBtn) {
        installPwaBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            // Para a animação
            installPwaBtn.style.animation = "none";
            // Mostra o prompt de instalação
            deferredPrompt.prompt();
            // Espera o usuário responder ao prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`PWA: Interação do usuário com o prompt: ${outcome}`);
            // O prompt só pode ser usado uma vez.
            deferredPrompt = null;
            // Esconde o botão, pois não pode ser usado de novo.
            installPwaBtn.classList.add('hidden');
        });
    }

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        console.log('PWA: Aplicativo instalado com sucesso!');
    });

    // 8. PWA: Registrar Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('PWA Service Worker registrado com sucesso!'))
            .catch(err => console.error('Erro ao registrar PWA:', err));
    }

    // --- FUNÇÕES PRINCIPAIS ---

    function handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.docx')) {
            importFromWord(file, event.target);
        } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            importFromExcel(file, event.target);
        } else {
            importFromCSV(file, event.target);
        }
    }

    // Helper para normalizar datas (aceita Date object, DD/MM/AAAA, AAAA-MM-DD)
    function parseDate(value) {
        if (!value) return null;
        
        // Converter para string e limpar aspas/espaços extras que vêm de CSVs sujos
        const valStr = String(value).replace(/['"]/g, '').trim();

        // Se for objeto Date do JS (vindo do Excel com cellDates: true)
        if (value instanceof Date && !isNaN(value)) {
            // Ajuste de fuso horário simples para evitar dia anterior
            const y = value.getFullYear();
            const m = String(value.getMonth() + 1).padStart(2, '0');
            const d = String(value.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }

        // Se for número (Excel Serial Date que escapou do cellDates:true) ex: 45000
        if (!isNaN(value) && Number(value) > 20000) {
            // Excel começa em 1900. Conversão aproximada segura
            const excelDate = new Date((value - (25567 + 2)) * 86400 * 1000);
            const y = value.getFullYear();
            const m = String(value.getMonth() + 1).padStart(2, '0');
            const d = String(value.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }

        // Regex para DD/MM/AAAA ou DD-MM-AAAA (Comum no Brasil)
        // Aceita separadores / . - e dias/meses com 1 ou 2 digitos
        const ptMatch = valStr.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
        if (ptMatch) {
            const d = ptMatch[1].padStart(2, '0');
            const m = ptMatch[2].padStart(2, '0');
            const y = ptMatch[3];
            return `${y}-${m}-${d}`;
        }

        // Regex para AAAA-MM-DD (ISO)
        const isoMatch = valStr.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
        if (isoMatch) {
            const y = isoMatch[1];
            const m = isoMatch[2].padStart(2, '0');
            const d = isoMatch[3].padStart(2, '0');
            return `${y}-${m}-${d}`;
        }

        return null;
    }

    // Novo: Importar Word via Mammoth
    function importFromWord(file, inputElement) {
        if (typeof mammoth === 'undefined') {
            alert('Erro: Biblioteca para ler Word não carregada.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            mammoth.extractRawText({arrayBuffer: arrayBuffer})
                .then(function(result){
                    const text = result.value;
                    // Quebra por linhas
                    const lines = text.split('\n');
                    parseAndImportLines(lines, inputElement, 'Word');
                })
                .catch(function(err){
                    console.error(err);
                    alert("Erro ao ler arquivo Word.");
                });
        };
        reader.readAsArrayBuffer(file);
    }

    // Função consolidada para processar linhas de texto (CSV ou Word extraído)
    function parseAndImportLines(lines, inputElement, sourceName = 'CSV') {
        let importedCount = 0;

        lines.forEach((line, index) => {
            // Pular cabeçalho óbvio
            if (index === 0 && line.toLowerCase().includes('nome') && line.toLowerCase().includes('data')) return;
            if (!line.trim()) return;

            // Estratégia de separação
            let parts = line.split(';');
            if (parts.length < 2) parts = line.split(',');
            if (parts.length < 2) parts = line.split('\t'); // Comum em Word
            if (parts.length < 2 && line.includes('  ')) parts = line.split(/\s{2,}/); // Espaços duplos

            let name, studentClass, dobRaw;

            // --- LÓGICA INTELIGENTE DE COLUNAS ---
            // Em vez de confiar na posição fixa, procuramos onde está a data

            // Verifica coluna 3 (índice 2) - Padrão: Nome, Turma, Data
            if (parts.length >= 3 && parseDate(parts[2])) {
                name = parts[0];
                studentClass = parts[1];
                dobRaw = parts[2];
            }
            // Verifica coluna 2 (índice 1) - Padrão: Nome, Data
            else if (parts.length >= 2 && parseDate(parts[1])) {
                name = parts[0];
                dobRaw = parts[1];
                // Se sobrar uma terceira coluna, assume que é turma (ex: Nome, Data, Turma)
                if (parts.length > 2) studentClass = parts[2]; 
                else studentClass = '';
            }
            // Verifica coluna 1 (índice 0) - Padrão: Data, Nome
            else if (parts.length >= 2 && parseDate(parts[0])) {
                dobRaw = parts[0];
                name = parts[1];
                if (parts.length > 2) studentClass = parts[2];
                else studentClass = '';
            }
            // Fallback para linhas com aspas ou formatos estranhos (CSV complexo)
            else if (parts.length >= 3) {
                // Tenta limpar aspas de tudo e verificar de novo
                if (parseDate(parts[2].replace(/['"]/g, ''))) {
                    name = parts[0];
                    studentClass = parts[1];
                    dobRaw = parts[2];
                }
            } 
            // Tentativa 3: Linha única do Word (Ex: "João Silva - 10/10/2010")
            else {
                // Tenta achar a data com regex na linha inteira
                const dob = parseDate(line);
                if (dob) {
                    // Se achou data, tenta remover a data da string para achar o nome
                    dobRaw = dob; // Já formatado
                    // Remove a data e separadores comuns do nome
                    name = line.replace(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/, '') // Remove DD/MM/AAAA
                               .replace(/\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/, '') // Remove ISO
                               .replace(/[\-\;\|\,]/g, '') // Remove pontuação que sobrou
                               .trim();
                    studentClass = '';
                } else {
                    return;
                }
            }

            const formattedDob = parseDate(dobRaw);

            if (formattedDob && name && name.length > 2) {
                students.push({
                    id: Date.now() + Math.random(),
                    name: name.replace(/['"]/g, '').trim(),
                    dob: formattedDob,
                    studentClass: studentClass ? studentClass.replace(/['"]/g, '').trim() : ''
                });
                importedCount++;
            }
        });

        if (importedCount > 0) {
            saveStudents();
            renderAll();
            alert(`${importedCount} alunos importados via ${sourceName} com sucesso!`);
        } else {
            alert(`Nenhum dado válido encontrado no arquivo ${sourceName}.`);
        }
        if(inputElement) inputElement.value = '';
    }

    function importFromCSV(file, inputElement) {
        // Adaptação: a função agora recebe o arquivo direto, não o evento
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const lines = text.split('\n');
            // Usa a nova função unificada
            parseAndImportLines(lines, inputElement, 'CSV');
        };
        reader.readAsText(file);
    }

    function importFromExcel(file, inputElement) {
        // Verifica se a biblioteca SheetJS foi carregada
        if (typeof XLSX === 'undefined') {
            alert('A biblioteca para ler Excel não foi encontrada.\nCertifique-se de adicionar <script src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"></script> ao seu HTML.');
            if(inputElement) inputElement.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            // cellDates: true converte automaticamente números de data do Excel para objetos Date do JS
            const workbook = XLSX.read(data, {type: 'array', cellDates: true});
            
            // Pega a primeira planilha
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Converte para JSON (Array de Arrays para facilitar mapeamento posicional)
            const rows = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            
            let importedCount = 0;

            rows.forEach((row, index) => {
                if (index === 0) return; // Pular cabeçalho
                if (!row || row.length < 2) return;

                // Lógica de colunas: 0=Nome, 1=Turma, 2=Data OU 0=Nome, 1=Data
                const name = row[0];
                let dobRaw, studentClass;

                // Tenta achar a data na coluna 2 (índice 2) ou 1 (índice 1)
                if (row[2] && (row[2] instanceof Date || String(row[2]).match(/\d/))) {
                    dobRaw = row[2];
                    studentClass = row[1] || '';
                } else {
                    dobRaw = row[1];
                    studentClass = '';
                }

                if (!name || !dobRaw) return;

                const formattedDob = parseDate(dobRaw);

                if (formattedDob) {
                    students.push({
                        id: Date.now() + Math.random(),
                        name: String(name).trim(),
                        dob: formattedDob,
                        studentClass: String(studentClass).trim()
                    });
                    importedCount++;
                }
            });

            if (importedCount > 0) {
                saveStudents();
                renderAll();
                alert(`${importedCount} alunos importados do Excel com sucesso!`);
            } else {
                alert('Nenhum dado válido encontrado no arquivo Excel.');
            }
            if(inputElement) inputElement.value = '';
        };
        reader.readAsArrayBuffer(file);
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

    function clearAllStudents() {
        if (students.length === 0) return alert("A lista já está vazia.");
        
        if (confirm('ATENÇÃO: Tem certeza que deseja apagar TODOS os alunos cadastrados?\n\nEsta ação não pode ser desfeita!')) {
            students = [];
            saveStudents();
            renderAll();
            alert('Todos os alunos foram removidos com sucesso.');
        }
    }

    function addStudent() {
        const name = nameInput.value.trim();
        const dob = dateInput.value; // Formato YYYY-MM-DD
        const studentClass = classInput ? classInput.value.trim() : '';

        if (!name || !dob || dob === "") {
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

        if (!Array.isArray(students)) students = []; // Segurança extra
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
        try {
            const parsed = stored ? JSON.parse(stored) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Banco de dados corrompido, reiniciando:", e);
            return [];
        }
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
