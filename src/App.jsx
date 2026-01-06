import { useMemo, useState } from "react";

const faixas = [
  { min: 0, max: 18.5, label: "Magreza" },
  { min: 18.5, max: 25, label: "Normal" },
  { min: 25, max: 30, label: "Sobrepeso" },
  { min: 30, max: 35, label: "Obesidade grau I" },
  { min: 35, max: 40, label: "Obesidade grau II" },
  { min: 40, max: Infinity, label: "Obesidade grau III" },
];

function classificar(imc) {
  const faixa = faixas.find((f) => imc >= f.min && imc < f.max);
  return faixa ? faixa.label : "—";
}

function toNumber(v) {
  const s = String(v ?? "").trim().replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

function alturaEmMetros(a) {
  if (!Number.isFinite(a)) return NaN;
  return a > 3 ? a / 100 : a;
}

export default function App() {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");

  const { imc, classificacao, erro } = useMemo(() => {
    if (!altura || !peso) return { imc: null, classificacao: "—", erro: "" };

    const aDigitada = toNumber(altura);
    const p = toNumber(peso);
    const a = alturaEmMetros(aDigitada);

    if (!Number.isFinite(a) || !Number.isFinite(p)) return { imc: null, classificacao: "—", erro: "Valores inválidos." };
    if (a <= 0 || p <= 0) return { imc: null, classificacao: "—", erro: "Altura e peso precisam ser maiores que zero." };

    const valor = p / (a * a);
    return { imc: valor, classificacao: classificar(valor), erro: "" };
  }, [altura, peso]);

  const imcFormatado = imc === null ? "—" : imc.toFixed(2);

  return (
    <main className="container">
      <header className="header">
        <h1>Calculadora de IMC</h1>
        <p>Digite altura (m ou cm) e peso (kg). O resultado atualiza automaticamente.</p>
      </header>

      <section className="card">
        <div className="grid">
          <label className="field">
            <span>Altura (m ou cm)</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Ex: 1,69 ou 169"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Peso (kg)</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Ex: 70"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
          </label>
        </div>

        <div className="result">
          <div>
            <div className="muted">Seu IMC</div>
            <div className="big">{imcFormatado}</div>
          </div>

          <div className="pill">
            <div className="muted">Classificação</div>
            <div className="strong">{classificacao}</div>
          </div>
        </div>

        {erro ? <div className="error">{erro}</div> : null}
      </section>

      <section className="tableCard">
        <h2>Tabela de classificação</h2>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>IMC</th>
                <th>Classificação</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>&lt; 18,5</td><td>Magreza</td></tr>
              <tr><td>18,5 a 24,9</td><td>Normal</td></tr>
              <tr><td>25,0 a 29,9</td><td>Sobrepeso</td></tr>
              <tr><td>30,0 a 34,9</td><td>Obesidade grau I</td></tr>
              <tr><td>35,0 a 39,9</td><td>Obesidade grau II</td></tr>
              <tr><td>&ge; 40,0</td><td>Obesidade grau III</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className="footer">
        <span>IMC = peso / (altura × altura)</span>
      </footer>
    </main>
  );
}
