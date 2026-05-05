// Data Arrays
let students = [
    { id: 1, firstName: "Ahmed", lastName: "Ben Ali", approved: true },
    { id: 2, firstName: "Fatma", lastName: "Khelifa", approved: true },
];
let pendingStudents = [];

let modules = [
    {
        id: 1,
        name: "Microprocesseurs et Microcontrôleurs",
        professor: "Dr. Amine",
        lessons: ["Introduction à l'architecture", "Bus et registres"],
        exercises: ["Calcul de cycles d'horloge"]
    }
];

let delegate = { firstName: "Sami", lastName: "Dahmani" };
let voteRequests = 0;
let voteActive = false;
let voteDeadline = null;
let candidates = [];
let votes = {};
let messages = [
    { sender: "Ahmed", content: "Bonjour, est-ce que le cours est dispo ?", time: "11:00" }
];

// UI Initialization
document.addEventListener("DOMContentLoaded", () => {
    renderStudents();
    renderModules();
    updateDelegateUI();
    document.getElementById("joinForm").addEventListener("submit", handleJoin);
    document.getElementById("addModuleForm").addEventListener("submit", handleAddModule);
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
});

// Students Handlers
function renderStudents() {
    const grid = document.getElementById("studentsGrid");
    grid.innerHTML = "";
    students.forEach(student => {
        grid.innerHTML += `
            <div class="glass-card p-6 rounded-2xl text-center border border-gray-900 bg-gray-900/50">
                <i class="fa-solid fa-graduation-cap text-indigo-400 text-3xl mb-4"></i>
                <h3 class="text-lg font-bold">${student.firstName} ${student.lastName}</h3>
                <span class="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Membre Actif</span>
            </div>
        `;
    });
}

function handleJoin(e) {
    e.preventDefault();
    const fn = document.getElementById("joinFirstName").value;
    const ln = document.getElementById("joinLastName").value;
    pendingStudents.push({ firstName: fn, lastName: ln });
    alert("Votre demande a été envoyée au délégué/administrateur !");
    document.getElementById("joinForm").reset();
    renderPendingList();
}

// Module Handlers
function renderModules() {
    const grid = document.getElementById("modulesGrid");
    grid.innerHTML = "";
    modules.forEach(m => {
        grid.innerHTML += `
            <div class="glass-card p-8 rounded-3xl border border-gray-800 bg-gray-900/40">
                <h4 class="text-xl font-bold text-indigo-400 mb-2">${m.name}</h4>
                <p class="text-xs text-gray-500 mb-6">Professeur : ${m.professor}</p>
                
                <div class="mb-6">
                    <h5 class="text-sm uppercase font-semibold tracking-wider text-gray-400 mb-3">Leçons</h5>
                    <ul class="space-y-2 text-sm text-gray-300">
                        ${m.lessons.map(l => `<li><i class="fa-solid fa-book text-gray-600 mr-2"></i> ${l}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="mb-6">
                    <h5 class="text-sm uppercase font-semibold tracking-wider text-gray-400 mb-3">Exercices</h5>
                    <ul class="space-y-2 text-sm text-gray-300">
                        ${m.exercises.map(ex => `<li><i class="fa-solid fa-pencil text-gray-600 mr-2"></i> ${ex}</li>`).join('')}
                    </ul>
                </div>

                <div class="flex gap-2">
                    <button onclick="addLessonPrompt(${m.id})" class="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg">Ajouter Leçon</button>
                    <button onclick="addExercisePrompt(${m.id})" class="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg">Ajouter Exercice</button>
                </div>
            </div>
        `;
    });
}

function handleAddModule(e) {
    e.preventDefault();
    const nm = document.getElementById("moduleName").value;
    const pf = document.getElementById("profName").value;
    modules.push({ id: modules.length + 1, name: nm, professor: pf, lessons: [], exercises: [] });
    renderModules();
    document.getElementById("addModuleForm").reset();
}

function addLessonPrompt(id) {
    const lesson = prompt("Nom de la leçon :");
    if (lesson) {
        modules.find(m => m.id === id).lessons.push(lesson);
        renderModules();
    }
}

function addExercisePrompt(id) {
    const exercise = prompt("Nom de l'exercice :");
    if (exercise) {
        modules.find(m => m.id === id).exercises.push(exercise);
        renderModules();
    }
}

// Delegate & Voting Handlers
function updateDelegateUI() {
    document.getElementById("currentDelegeName").innerText = `${delegate.firstName} ${delegate.lastName}`;
    document.getElementById("voteRequestBtn").innerText = `Demander un vote (${voteRequests}/5)`;
}

function requestVote() {
    voteRequests++;
    updateDelegateUI();
    if (voteRequests >= 5) {
        startElection();
    }
}

function startElection() {
    if (voteActive) return;
    voteActive = true;
    voteDeadline = new Date().getTime() + 48 * 60 * 60 * 1000;
    candidates = students.map(s => ({ ...s, votes: 0 }));

    document.getElementById("voteSection").classList.remove("hidden");
    renderCandidates();
    startTimer();
}

function renderCandidates() {
    const list = document.getElementById("voteCandidatesList");
    list.innerHTML = "";
    candidates.forEach((c, index) => {
        list.innerHTML += `
            <div class="flex justify-between items-center bg-gray-950 p-4 rounded-xl border border-gray-800">
                <span>${c.firstName} ${c.lastName}</span>
                <button onclick="voteForCandidate(${index})" class="text-xs bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition">Voter</button>
            </div>
        `;
    });
}

function voteForCandidate(idx) {
    candidates[idx].votes++;
    alert("Votre vote a été pris en compte !");
}

function startTimer() {
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = voteDeadline - now;

        if (distance < 0) {
            clearInterval(timerInterval);
            endElection();
        } else {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("voteTimer").innerText = `Se termine dans : ${hours}h ${minutes}m`;
        }
    }, 1000);
}

function endElection() {
    voteActive = false;
    voteRequests = 0;
    if (candidates.length > 0) {
        let winner = candidates.reduce((prev, current) => (prev.votes > current.votes) ? prev : current);
        delegate = winner;
        alert(`L'élection est terminée ! Le nouveau délégué est ${winner.firstName} ${winner.lastName}`);
    }
    document.getElementById("voteSection").classList.add("hidden");
    updateDelegateUI();
}

// Chat Handlers
function openChat() {
    document.getElementById("chatAuthPanel").classList.add("hidden");
    document.getElementById("chatWindow").classList.remove("hidden");
    document.getElementById("chatUserDisplay").innerText = `Utilisateur connecté - ${students[0].firstName}`;
    renderMessages();
}

function sendMessage() {
    const content = document.getElementById("chatInput").value;
    if (!content.trim()) return;
    messages.push({ sender: students[0].firstName, content, time: "Juste maintenant" });
    document.getElementById("chatInput").value = "";
    renderMessages();
}

function renderMessages() {
    const area = document.getElementById("messagesArea");
    area.innerHTML = "";
    messages.forEach(m => {
        area.innerHTML += `
            <div class="p-3 bg-gray-900 border border-gray-800 rounded-xl max-w-xs">
                <span class="block text-indigo-400 font-bold text-xs">${m.sender}</span>
                <p class="text-sm mt-1">${m.content}</p>
                <span class="block text-right text-gray-600 text-[10px] mt-2">${m.time}</span>
            </div>
        `;
    });
}

// Authentication / Approvals
function openAuthModal() {
    document.getElementById("authModal").classList.remove("hidden");
    document.getElementById("authModal").style.display = "flex";
    renderPendingList();
}

function closeAuthModal() {
    document.getElementById("authModal").classList.add("hidden");
}

function handleLogin(e) {
    e.preventDefault();
    const pw = document.getElementById("adminPassword").value;
    if (pw === "admin123") {
        document.getElementById("approvalPanel").classList.remove("hidden");
    } else {
        alert("Mot de passe incorrect.");
    }
}

function renderPendingList() {
    const list = document.getElementById("pendingList");
    list.innerHTML = "";
    if (pendingStudents.length === 0) {
        list.innerHTML = `<p class="text-gray-500 text-sm p-4">Aucune demande en attente.</p>`;
        return;
    }
    pendingStudents.forEach((s, index) => {
        list.innerHTML += `
            <div class="flex justify-between items-center bg-gray-950 px-3 py-2 rounded-xl text-xs">
                <span>${s.firstName} ${s.lastName}</span>
                <div class="flex gap-2">
                    <button onclick="approveStudent(${index})" class="text-green-400">Accepter</button>
                    <button onclick="rejectStudent(${index})" class="text-red-400">Refuser</button>
                </div>
            </div>
        `;
    });
}

function approveStudent(index) {
    let student = pendingStudents.splice(index, 1)[0];
    students.push({ id: students.length + 1, ...student });
    renderStudents();
    renderPendingList();
    openAuthModal();
}

function rejectStudent(index) {
    pendingStudents.splice(index, 1);
    renderPendingList();
    openAuthModal();
}
