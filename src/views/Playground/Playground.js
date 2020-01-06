import React, { useState } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/theme-twilight";
import styles from "assets/jss/material-kit-react/views/playground.js";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import {js} from 'js-beautify'
import {Canvas, Debug, Error, Info} from './components'
import chapter from './chapters'

const consolePrint = console.log
const beautify = js
const useStyles = makeStyles(styles);

export default function Playground(props) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [currentCode, setCode] = useState(beautify(chapter[page].defaultCode));

  let unsavedCode = currentCode
  let log = []
  let canvas
  let debug

  console.log = function(...args){
    args.forEach(e=>{
      log.push(e)
    })
  }

  try {
    let node = new Function(`${currentCode}; return Node`)()

    //Tests all edge cases before the real run
    let BinaryTree = new node(50)
    if(typeof BinaryTree.left === 'undefined'){
      throw {name: 'ReferenceError', message: "BinaryTree.left is not defined"}
    }
    if(typeof BinaryTree.right === 'undefined'){
      throw {name: 'ReferenceError', message: "BinaryTree.right is not defined"}
    }
    if(typeof BinaryTree.value === 'undefined'){
      throw {name: 'ReferenceError', message: "BinaryTree.value is not defined"}
    }
    BinaryTree.insert(25)
    BinaryTree.insert(15)
    BinaryTree.insert(35)
    BinaryTree.insert(75)
    BinaryTree.insert(85)
    BinaryTree.insert(65)

    //True Initialization
    let tree = new node(50)

    canvas = <Canvas tree={tree} size={28} />
    console.log('Success')
  } catch (err) {
    canvas = <Error type={err.name}>{err.message}</Error>
    console.log('Error')
  } finally {
    debug = <Debug data={log}/>
  }

  return (
    <>
      <div className={classes.margin}>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <GridContainer>
                <GridItem xs={12} sm={5} md={5}>
                  <AceEditor
                    mode="javascript"
                    theme="twilight"
                    name="code"
                    width="100%"
                    height="600px"
                    value={currentCode}
                    onChange={(val)=> unsavedCode = val}
                    enableBasicAutocompletion={true}
                    enableLiveAutocompletion={true}
                    editorProps={{ $blockScrolling: false }}
                  />
                  {debug}
                  <div className={classes.codeButtons}>
                    <Button 
                      color="white"
                      simple={true}
                      onClick={()=>setCode(unsavedCode)}
                    > Run Code </Button>
                    <Button 
                      color="warning"
                      simple={true}
                      onClick={()=>setCode(beautify(chapter[page].defaultCode))}
                    > Reset </Button>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={7} md={7}>
                  <div className={classes.canvasRegion}>
                    <div className={classes.titleRegion}>
                      <h1>Binary Trees</h1>
                      <h2>Introduction</h2>
                    </div>
                    <SplitterLayout vertical={true} customClassName={classes.splitter} secondaryInitialSize={160}>
                      {canvas}
                      <Info text={chapter[page].lesson}/>
                    </SplitterLayout>
                  </div>
                </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    </>
  );
}
