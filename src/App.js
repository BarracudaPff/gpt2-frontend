import React, {Fragment, useState} from 'react';
import './App.css';
import {Button as MaterialButton} from "@material-ui/core";
import SelectBox from "./components/SelectBox";
import TextField from "@material-ui/core/TextField";
import {getPrefix, postGenerateTextEndpoint, replaceTabs} from "./utils";
import Checkbox from "@material-ui/core/Checkbox";

function App() {
    const [text, setText] = useState("");
    const [only_full_lines, setOnly_full_lines] = useState(false);
    const [group_answers, setGroup_answers] = useState(false);
    const [replaceTab, setReplaceTab] = useState(true);
    const [beam_size, setBeam_size] = useState(5);
    const [num_iterations, setNum_iterations] = useState(10);
    const [prefix, setPrefix] = useState("");
    const [model, setModel] = useState('gpt-checkpoint1');
    const [generatedText, postGenerateText] = postGenerateTextEndpoint();

    const generateText = () => {
        console.log({
            code: replaceTab ? replaceTabs(text) : text,
            prefix,
            offset: text.length,
            filename: "main.py",
            mode: "FULL_LINE",
            beam_size,
            num_iterations,
            only_full_lines,
            group_answers
        })
        postGenerateText({
            code: text,
            prefix,
            offset: text.length,
            filename: "main.py",
            mode: "FULL_LINE",
            beam_size,
            num_iterations,
            only_full_lines,
            group_answers
            // model,
            // userId: 1
        });
    }

    return (
        <div className="flexbox-container">
            <form noValidate autoComplete='off' style={{margin: 8, alignItems: 'center'}}>
                <h1>React GPT-2</h1>
                <div>
                    <div>
                        <Fragment>Only full lines</Fragment>
                        <Checkbox
                            label="Only full lines"
                            value={only_full_lines}
                            onChange={(event, checked) => setOnly_full_lines(checked)}
                        />
                    </div>
                    <div>
                        <Fragment>Group answers</Fragment>
                        <Checkbox
                            label="Group answers"
                            value={group_answers}
                            onChange={(event, checked) => setGroup_answers(checked)}
                        />
                    </div>
                    <div>
                        <Fragment>Replace tab (auto replacing 4 spaces with tab)</Fragment>
                        <Checkbox
                            label="Group answers"
                            value={replaceTab}
                            onChange={(event, checked) => setReplaceTab(checked)}
                        />
                    </div>
                    <TextField
                        label="Beam size"
                        style={{marginRight: 16, width: 100, marginTop: 16}}
                        inputMode={"numerical"}
                        value={beam_size}
                        onChange={e => {
                            const num = parseInt(e.target.value)
                            num ? setBeam_size(num) : setBeam_size(0)
                        }}
                    />
                    <TextField
                        label="Num Iteration"
                        style={{marginRight: 16, width: 100, marginTop: 16}}
                        inputMode={"numerical"}
                        value={num_iterations}
                        onChange={e => {
                            const num = parseInt(e.target.value)
                            num ? setNum_iterations(num) : setNum_iterations(0)
                        }}
                    />
                    <SelectBox model={model} setModel={setModel}/>
                </div>
                <TextField
                    margin='normal'
                    label="Write something..."
                    variant="outlined"
                    fullWidth
                    multiline
                    rows='4'
                    value={text}
                    onChange={e => {
                        setText(e.target.value)
                        setPrefix(getPrefix(e.target.value))
                    }}
                />
                <MaterialButton
                    style={{marginTop: '1em', width: 'fit-content'}}
                    onClick={generateText}
                    variant="outlined"
                    color="primary">
                    Generate
                </MaterialButton>
            </form>

            {generatedText.pending &&
            <div className='result pending'>Please wait</div>}

            {generatedText.complete &&
            (generatedText.error ?
                <div className='result error'>Bad Request</div> :
                <div className='result valid' style={{margin: 8}}>
                    {generatedText.data.completions.map(txt => <p><code>{txt}</code></p>)}}
                </div>)}
        </div>
    );
}

export default App;
