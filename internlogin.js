const interns=[
{name:'Jamalluddin',dept:'Frontend Development',attendance:88,marks:82,level:2,pending:2,missed:2},
{name:'Usmaniya',dept:'Web Design',attendance:91,marks:86,level:2,pending:1,missed:1},
{name:'Saniya Taj',dept:'Java Basics',attendance:84,marks:79,level:1,pending:3,missed:3},
{name:'Noorani',dept:'Python Basics',attendance:80,marks:75,level:1,pending:2,missed:2},
{name:'Sayeda',dept:'IT Training',attendance:93,marks:89,level:3,pending:0,missed:0},
{name:'Dhanush V',dept:'Frontend Development',attendance:86,marks:81,level:2,pending:1,missed:1}
];

const mentors=[
{name:'Sahana',dept:'Frontend Mentor'},
{name:'Dhanush RV',dept:'Technical Mentor'}
];

const quizQuestions=[
{q:'Which tag is used to create a heading in HTML?',a:['<p>','<h1>','<img>'],c:1},
{q:'Which CSS property changes text color?',a:['font-size','color','margin'],c:1},
{q:'Which language makes a webpage interactive?',a:['JavaScript','HTML only','CSS only'],c:0},
{q:'Which symbol is used for an ID selector in CSS?',a:['.','#','@'],c:1},
{q:'Which method shows a popup in JavaScript?',a:['alert()','print()','show()'],c:0}
];

function tasks(){
return JSON.parse(localStorage.getItem('portalTasks')||'[]')
}

function saveTasks(t){
localStorage.setItem('portalTasks',JSON.stringify(t))
}

function msgs(){
return JSON.parse(localStorage.getItem('portalMessages')||'[]')
}

function saveMsgs(m){
localStorage.setItem('portalMessages',JSON.stringify(m))
}

function badgeStore(){
return JSON.parse(localStorage.getItem('portalBadges')||'{}')
}

function saveBadges(b){
localStorage.setItem('portalBadges',JSON.stringify(b))
}

function quizStore(){
return JSON.parse(localStorage.getItem('portalQuizScores')||'{}')
}

function saveQuiz(q){
localStorage.setItem('portalQuizScores',JSON.stringify(q))
}

function calcXP(i){
let qs=quizStore()[i.name]?.score||0;
let admin=(badgeStore()[i.name]||[]).length*80;
return i.marks*10+i.attendance*3-(i.missed||0)*20+qs*50+admin
}

function calcBadge(i){
if((quizStore()[i.name]?.score||0)>=4)return '🧠 Quiz Master';
if(i.marks>=88)return '🏆 Elite Performer';
if(i.marks>=82)return '🥇 Pro Coder';
return '🥈 Skill Builder'
}

function calcProgress(i){
return Math.min(100,Math.round((i.marks+i.attendance+(quizStore()[i.name]?.score||0)*10)/2.2))
}

function allBadges(i){
return [calcBadge(i)].concat(badgeStore()[i.name]||[])
}

function title(h,p){
return `<div class="hero"><h1 class="game-title">${h}</h1><p>${p}</p></div>`
}

function active(s){
document.querySelectorAll('.nav-links button').forEach(b=>b.classList.remove('active'));
document.getElementById('nav-'+s)?.classList.add('active')
}

function chatUI(options){
return `<div class="card">
<label>Chat With</label>
<select id="chatTo" onchange="renderChat()">
${options.map(x=>`<option>${x}</option>`).join('')}
</select>
<div class="chat-box" id="chatBox"></div>
<div class="chat-row">
<input id="chatText" placeholder="Type message...">
<button class="btn" onclick="sendMessage()">Send</button>
</div>
</div>`
}

function renderChat(){
let from=currentName();
let to=document.getElementById('chatTo')?.value;
let box=document.getElementById('chatBox');

if(!box)return;

let m=msgs().filter(x=>
(x.from===from&&x.to===to)||(x.from===to&&x.to===from)
);

box.innerHTML=m.length
?m.map(x=>`<div class="msg ${x.from===from?'sent':'received'}"><b>${x.from}</b><br>${x.text}</div>`).join('')
:`<div class="msg received">No messages yet.</div>`
}

function sendMessage(){
let text=document.getElementById('chatText').value.trim();
if(!text)return;

let m=msgs();
m.push({
from:currentName(),
to:document.getElementById('chatTo').value,
text
});

saveMsgs(m);
document.getElementById('chatText').value='';
renderChat()
}

const validUsers={
'jamalluddin':'Jamalluddin',
'jamal':'Jamalluddin',
'usmaniya':'Usmaniya',
'saniya taj':'Saniya Taj',
'saniya':'Saniya Taj',
'noorani':'Noorani',
'sayeda':'Sayeda',
'dhanush v':'Dhanush V',
'dhanush':'Dhanush V'
};

function loginUser(){
let e=document.getElementById('loginName').value.trim().toLowerCase();
if(!validUsers[e])return alert('Enter valid intern name.');

localStorage.setItem('internUser',validUsers[e]);
location.href='interndash.html'
}

function user(){
let n=localStorage.getItem('internUser')||'Jamalluddin';
return interns.find(i=>i.name===n)||interns[0]
}

function currentName(){
return user().name
}

let answers={};

function showSection(s){
active(s);

let app=document.getElementById('app');
let u=user();

document.getElementById('profileInitial').innerText=u.name[0];

if(s==='home'){
let mt=tasks().filter(t=>t.to===u.name);

app.innerHTML=
title(`Welcome, ${u.name}`,'Game-style dashboard with XP, badges, quiz rewards, catch-up support, and progress tracking.')+

`<div class="grid grid-4">
<div class="card game-card">
<h3>⭐ XP Points</h3>
<div class="metric">${calcXP(u)}</div>
<div class="xp-bar">
<div class="xp-fill" style="width:${calcProgress(u)}%"></div>
</div>
<p>XP updates from marks, attendance, quizzes, and admin badges.</p>
</div>

<div class="card game-card">
<h3>🎖 Badges</h3>
<div class="badge-box">
${allBadges(u).map(b=>`<span class="game-badge">${b}</span>`).join('')}
</div>
</div>

<div class="card">
<h3>📊 Progress</h3>
<div class="metric">${calcProgress(u)}%</div>
</div>

<div class="card">
<h3>🧠 Quiz Score</h3>
<div class="metric">${quizStore()[u.name]?.score||0}/5</div>
</div>

<div class="card">
<h3>Attendance</h3>
<div class="metric">${u.attendance}%</div>
</div>

<div class="card">
<h3>Marks</h3>
<div class="metric">${u.marks}</div>
</div>

<div class="card">
<h3>Assigned Tasks</h3>
<div class="metric">${mt.length}</div>
</div>
</div>

<br>

<div class="card quest">
<h3>🤖 Automated Catch-Up System</h3>
<p>Missed class resources, MCQ quizzes, badge rewards, and progress tracking work automatically.</p>
</div>`
}

if(s==='task'){
let mt=tasks().filter(t=>t.to===u.name);
app.innerHTML=title('My Quests','Tasks assigned by mentor or admin are shown like game quests.')+taskTable(mt)
}

if(s==='notification'){
let mt=tasks().filter(t=>t.to===u.name);

app.innerHTML=
title('Notifications','Latest assigned work and catch-up alerts.')+

`<div class="grid">
${u.missed>0?`<div class="card quest"><h3>⚠ Catch-Up Alert</h3><p>You missed ${u.missed} class(es). Complete MCQ quiz to unlock Quiz Master badge.</p></div>`:''}

${mt.length?
mt.map(t=>`<div class="card"><h3>${t.title}</h3><p>${t.desc}</p></div>`).join('')
:`<div class="card"><h3>No task notifications</h3><p>No new assigned work.</p></div>`}
</div>`
}

if(s==='training'){
answers={};

app.innerHTML=
title('Training + MCQ Arena','Complete MCQ quiz to earn XP and badges.')+

`<div class="grid grid-3">
${training('🐍','Python Training','https://www.youtube.com/results?search_query=python+training+for+beginners')}
${training('☕','Java Training','https://www.youtube.com/results?search_query=java+training+for+beginners')}
${training('💻','IT Training','https://www.youtube.com/results?search_query=it+training+for+students')}
</div>

<br>

<div class="grid grid-2">
<div class="card quest">
<h3>📚 Auto Resource</h3>
<p>Recommended resource for missed class revision.</p>
<button class="btn" onclick="window.open('https://www.youtube.com/results?search_query=html+css+javascript+beginner+tutorial','_blank')">
Open Catch-Up Resource
</button>
</div>

<div class="card quiz-card">
<h3>🧠 MCQ Quiz Battle</h3>
<p>Score 4/5 or more to unlock Quiz Master badge.</p>
${renderQuiz()}
<button class="btn" onclick="submitQuiz()">Submit Quiz</button>
<p id="quizResult"></p>
</div>
</div>`
}

if(s==='chat'){
app.innerHTML=title('Chat','Chat with mentor and admin.')+chatUI(['Admin','Sahana','Dhanush RV']);
renderChat()
}

if(s==='roadmap'){
app.innerHTML=
title('Game Roadmap','Journey is divided into levels, badges, quiz and XP growth.')+

`<div class="grid grid-3">
<div class="card game-card"><h3>Level 1 ✅</h3><p>Company details and rules.</p></div>
<div class="card game-card"><h3>Level 2 ✅</h3><p>Understand internship skills.</p></div>
<div class="card game-card"><h3>Level 3 ⭐</h3><p>Build HTML and CSS page.</p></div>
<div class="card game-card"><h3>Level 4 🔒</h3><p>Make page interactive.</p></div>
<div class="card game-card"><h3>Level 5 🔒</h3><p>Complete MCQ catch-up quiz.</p></div>
</div>`
}
}

function renderQuiz(){
return quizQuestions.map((q,i)=>`
<div class="quiz-question">
<h3>Q${i+1}. ${q.q}</h3>
${q.a.map((a,j)=>`<button class="quiz-option" onclick="selectAnswer(${i},${j},this)">${a}</button>`).join('')}
</div>`).join('')
}

function selectAnswer(q,a,btn){
answers[q]=a;
btn.parentElement.querySelectorAll('.quiz-option').forEach(x=>x.classList.remove('selected'));
btn.classList.add('selected')
}

function submitQuiz(){
let score=0;

quizQuestions.forEach((q,i)=>{
if(answers[i]===q.c)score++
});

let q=quizStore();
q[user().name]={score,total:5,date:new Date().toLocaleDateString()};
saveQuiz(q);

document.getElementById('quizResult').innerHTML=
score>=4
?`✅ Score ${score}/5. Quiz Master badge unlocked!`
:`Score ${score}/5. Try again to unlock badge.`
}

function taskTable(a){
return `<div class="card table-wrap">
<table>
<tr>
<th>Quest</th>
<th>By</th>
<th>Deadline</th>
<th>Status</th>
<th>Description</th>
</tr>
${a.length
?a.map(t=>`
<tr>
<td>🎯 ${t.title}</td>
<td>${t.by}</td>
<td>${t.deadline}</td>
<td><span class="badge">${t.status}</span></td>
<td>${t.desc}</td>
</tr>`).join('')
:`<tr><td colspan="5">No quests assigned yet.</td></tr>`}
</table>
</div>`
}

function training(i,n,l){
return `<div class="card training-card" onclick="window.open('${l}','_blank')">
<div class="thumb">${i}</div>
<div class="training-body">
<h3>${n}</h3>
<p>Watch videos, complete quiz, and earn XP.</p>
</div>
</div>`
}

function showProfile(){
let u=user();
alert(`Name: ${u.name}\nXP: ${calcXP(u)}\nBadges: ${allBadges(u).join(', ')}`)
}

if(document.getElementById('app')){
showSection('home')
}