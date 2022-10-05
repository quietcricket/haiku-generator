import React, { useState } from 'react';
import './App.css';
const SERVER_URL = '';

type HaikuEntry = {
	words: string,
	text: string
}

function Haiku(prop: HaikuEntry) {
	return (
		<div className='Haiku'>
			<h3>{prop.words}</h3>
			<p dangerouslySetInnerHTML={{ __html: prop.text }}></p>
		</div>
	)
}

function OpenaiForm(prop: { list: HaikuEntry[], setList: (l: HaikuEntry[]) => void }) {
	const [words, setWords] = useState<string>('')
	const [japanese, setJapanese] = useState<boolean>(true)
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		if (words.trim().length == 0) return;
		e.preventDefault();
		const form = e.currentTarget;
		form.classList.add("disabled");
		let url = new URL(SERVER_URL);
		url.searchParams.set('words', words);
		url.searchParams.set('language', japanese ? 'Japanese' : 'English')
		fetch(url.href).
			then(resp => resp.text()).
			then(v => {
				v = v.replace(/^\n+/, "");
				v = v.replace(/\n/g, '<br/>')
				prop.setList([{ words: words, text: v }, ...prop.list]);
				form.classList.remove('disabled');
			}
			);
	}
	return (
		<form onSubmit={handleSubmit}>
			<label>Please type a topic</label><br />
			<br />
			<input type="text" onChange={e => setWords(e.target.value)} /><br />
			<label><input type="checkbox" defaultChecked={japanese} onChange={e => setJapanese(e.target.checked)} /> Japanese</label>
			<br />
			<br />
			<input type="submit" value="Generate Haiku" />
		</form>
	)
}

function App() {
	const [haikuList, setHaikuList] = useState<HaikuEntry[]>([]);
	return (
		<div className="App">
			<h2>Haiku Generator</h2>
			<OpenaiForm list={haikuList} setList={setHaikuList} />
			<div className='list'>
				{haikuList.map(e => {
					return (<Haiku words={e.words} text={e.text} />)
				})}
			</div>
		</div>
	);
}

export default App;
