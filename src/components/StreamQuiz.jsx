import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";

// ===== Expanded Question Bank =====
const QUESTIONS = [
  // Interests
  { id: "int_math", text: "I enjoy solving mathematics problems (algebra, geometry, puzzles).", kind: "likert", scaleWeight: { science: 1.2, commerce: 0.8, arts: 0.2 } },
  { id: "int_bio", text: "I am curious about how living organisms and the human body work.", kind: "likert", scaleWeight: { science: 1.3, commerce: 0.2, arts: 0.2 } },
  { id: "int_physics", text: "I like understanding how machines, gadgets, and physical systems work.", kind: "likert", scaleWeight: { science: 1.2, commerce: 0.3, arts: 0.2 } },
  { id: "int_finance", text: "I follow business, markets, or personal finance topics.", kind: "likert", scaleWeight: { science: 0.3, commerce: 1.3, arts: 0.3 } },
  { id: "int_acc", text: "I’m comfortable with accounts: debits/credits, statements, or tracking expenses.", kind: "likert", scaleWeight: { science: 0.2, commerce: 1.3, arts: 0.3 } },
  { id: "int_hum", text: "I enjoy history, literature, languages, philosophy, or social sciences.", kind: "likert", scaleWeight: { science: 0.2, commerce: 0.3, arts: 1.3 } },
  { id: "int_creative", text: "I like expressing myself through art, writing, music, or drama.", kind: "likert", scaleWeight: { science: 0.2, commerce: 0.2, arts: 1.4 } },

  // Aptitude
  { id: "apt_analysis", text: "I can analyze data/tables quickly and find patterns.", kind: "likert", scaleWeight: { science: 0.9, commerce: 1.2, arts: 0.5 } },
  { id: "apt_lab", text: "I enjoy hands-on experiments or building things (labs, kits, DIY).", kind: "likert", scaleWeight: { science: 1.3, commerce: 0.2, arts: 0.4 } },
  { id: "apt_logic", text: "I’m strong at logic/critical reasoning and enjoy tough problems.", kind: "likert", scaleWeight: { science: 1.1, commerce: 1.0, arts: 0.6 } },
  { id: "apt_comm", text: "I can communicate ideas clearly (speaking, debating, presenting).", kind: "likert", scaleWeight: { science: 0.5, commerce: 0.8, arts: 1.1 } },
  { id: "apt_detail", text: "I’m detail-oriented and careful with rules, procedures, and accuracy.", kind: "likert", scaleWeight: { science: 0.9, commerce: 1.1, arts: 0.5 } },
  { id: "apt_mem", text: "I have a good memory for facts, dates, or concepts.", kind: "likert", scaleWeight: { science: 0.7, commerce: 0.8, arts: 1.0 } },

  // Preferences (Choice)
  { id: "pref_project", text: "If I had to choose a year-long project, I’d prefer:", kind: "choice", options: [
    { value: "research", label: "Designing and testing a science project", weights: { science: 2.0, commerce: 0.3, arts: 0.3 } },
    { value: "startup", label: "Starting a small business or stock-market simulation", weights: { science: 0.3, commerce: 2.0, arts: 0.3 } },
    { value: "documentary", label: "Creating a documentary/novella on a social theme", weights: { science: 0.3, commerce: 0.3, arts: 2.0 } }
  ] },
  { id: "pref_env", text: "The work environment I imagine myself in is:", kind: "choice", options: [
    { value: "lab", label: "Labs, workshops, or tech studios", weights: { science: 1.6, commerce: 0.4, arts: 0.6 } },
    { value: "office", label: "Corporate/finance offices working with numbers/clients", weights: { science: 0.4, commerce: 1.6, arts: 0.6 } },
    { value: "studio", label: "Studios/classrooms/fieldwork with people and ideas", weights: { science: 0.6, commerce: 0.6, arts: 1.6 } }
  ] },
  { id: "pref_subject", text: "Which set sounds most appealing?", kind: "choice", options: [
    { value: "pcm/pcb", label: "Physics / Chemistry / Maths / Biology", weights: { science: 2.0, commerce: 0.3, arts: 0.3 } },
    { value: "acc/eco", label: "Accountancy / Economics / Business Studies", weights: { science: 0.3, commerce: 2.0, arts: 0.3 } },
    { value: "hum", label: "History / Political Science / Literature / Psychology", weights: { science: 0.3, commerce: 0.3, arts: 2.0 } }
  ] },
  { id: "pref_task", text: "Pick the task you’d most enjoy:", kind: "choice", options: [
    { value: "code", label: "Coding/robotics challenge", weights: { science: 1.8, commerce: 0.5, arts: 0.4 } },
    { value: "budget", label: "Planning a budget & analyzing spending data", weights: { science: 0.5, commerce: 1.8, arts: 0.4 } },
    { value: "festival", label: "Curating a cultural festival or magazine", weights: { science: 0.4, commerce: 0.5, arts: 1.8 } }
  ] },
  { id: "pref_success", text: "How do you define success?", kind: "choice", options: [
    { value: "invent", label: "Inventing or solving real-world problems with technology", weights: { science: 1.6, commerce: 0.6, arts: 0.6 } },
    { value: "wealth", label: "Building wealth/value through business and finance", weights: { science: 0.6, commerce: 1.6, arts: 0.6 } },
    { value: "impact", label: "Shaping society/culture through ideas, stories, and policy", weights: { science: 0.6, commerce: 0.6, arts: 1.6 } }
  ] },
  { id: "pref_exam", text: "Your exam style preference is:", kind: "choice", options: [
    { value: "problem", label: "Numerical problems and derivations", weights: { science: 1.7, commerce: 1.0, arts: 0.4 } },
    { value: "case", label: "Case studies and business scenarios", weights: { science: 0.8, commerce: 1.7, arts: 0.5 } },
    { value: "essays", label: "Long-form answers, essays, and presentations", weights: { science: 0.5, commerce: 0.8, arts: 1.7 } }
  ] }
];

const LIKERT = [1,2,3,4,5];
const STREAM_LABEL = {
  science: "Science (PCM/PCB/CS)",
  commerce: "Commerce (Accounts/Economics/Business)",
  arts: "Arts & Humanities (Humanities/Social Sciences)"
};
const CAREER_SUGGESTIONS = {
  science: ["Engineering, CS/AI, Data Science","Medicine, Pharma, Biotech","Research, Defense, Space, Environmental Science"],
  commerce: ["Chartered Accountancy, CMA, CS","Finance/Banking, Analytics, FinTech","Business, Marketing, Entrepreneurship"],
  arts: ["Law, Civil Services, International Relations","Psychology, Sociology, Education","Design, Media, Literature, Performing Arts"]
};

function normalize(weights){
  const total = weights.science + weights.commerce + weights.arts;
  if (!total) return { science:0, commerce:0, arts:0 };
  return {
    science: (weights.science/total)*100,
    commerce: (weights.commerce/total)*100,
    arts: (weights.arts/total)*100
  };
}
function rank(streams){
  return Object.entries(streams).sort((a,b)=>b[1]-a[1]);
}

export default function StreamQuiz(){
  const [answers,setAnswers] = useState({});
  const [showResults,setShowResults] = useState(false);

  const { scores, ranks } = useMemo(()=>{
    const raw = { science:0, commerce:0, arts:0 };
    for(const q of QUESTIONS){
      const a = answers[q.id];
      if(!a) continue;
      if(q.kind==="likert"){
        const val = Number(a)||0;
        raw.science += val*q.scaleWeight.science;
        raw.commerce += val*q.scaleWeight.commerce;
        raw.arts += val*q.scaleWeight.arts;
      } else {
        const opt = q.options.find(o=>o.value===a);
        if(opt){
          raw.science += opt.weights.science;
          raw.commerce += opt.weights.commerce;
          raw.arts += opt.weights.arts;
        }
      }
    }
    return { scores: normalize(raw), ranks: rank(normalize(raw)) };
  },[answers]);

  const top = ranks?.[0]?.[0];
  const second = ranks?.[1]?.[0];

  function downloadPdf(){
    if(!top) return;
    const doc = new jsPDF();
    doc.text("Stream Determination Quiz Result",10,20);
    doc.text(`Primary: ${STREAM_LABEL[top]}`,10,40);
    if(second) doc.text(`Secondary: ${STREAM_LABEL[second]}`,10,50);
    let y=70;
    Object.entries(scores).forEach(([k,v])=>{
      doc.text(`${STREAM_LABEL[k]}: ${v.toFixed(1)}%`,10,y);
      y+=10;
    });
    doc.text("Possible Careers:",10,y+10);
    CAREER_SUGGESTIONS[top].forEach((c,i)=>doc.text(`- ${c}`,15,y+20+i*10));
    doc.save("quiz_recommendation.pdf");
  }

  return (
    <div style={{maxWidth:800,margin:"0 auto",padding:20}}>
      <h2>Stream Determination Quiz</h2>
      <form onSubmit={(e)=>{e.preventDefault();setShowResults(true);}}>
        {QUESTIONS.map(q=>(
          <div key={q.id} style={{marginBottom:16}}>
            <p>{q.text}</p>
            {q.kind==="likert" ? (
              LIKERT.map(v=><label key={v}><input type="radio" name={q.id} value={v} checked={answers[q.id]===v} onChange={()=>setAnswers(p=>({...p,[q.id]:v}))}/> {v} </label>)
            ):(
              q.options.map(opt=><label key={opt.value}><input type="radio" name={q.id} value={opt.value} checked={answers[q.id]===opt.value} onChange={()=>setAnswers(p=>({...p,[q.id]:opt.value}))}/> {opt.label} </label>)
            )}
          </div>
        ))}
        <button type="submit">See Recommendation</button>
      </form>

      {showResults && top && (
        <div style={{marginTop:20}}>
          <h3>Recommended Stream</h3>
          <p>Primary: {STREAM_LABEL[top]} {second && `| Secondary: ${STREAM_LABEL[second]}`}</p>
          <ul>{CAREER_SUGGESTIONS[top].map(c=><li key={c}>{c}</li>)}</ul>
          <button onClick={downloadPdf}>Download PDF</button>
        </div>
      )}
    </div>
  );
}
