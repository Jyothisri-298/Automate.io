const program = require('commander');
const inquirer = require('inquirer');
const request = require('request');


//Method to get word definitions
function getDefinitions(word){
    var url = "https://fourtytwowords.herokuapp.com/word/"+word+"/definitions?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164"
    return new Promise(function(resolve,reject){
        request(url,function(err,res,body){
            if(err){
                reject("There is some problem with API. Try again after sometime.\n")
            }
            else{
                let obj = JSON.parse(body);
                // console.log(obj);
                if(obj.error == "word not found"){
                    reject("The word not found in Dictionary");
                }
                else{
                    let defn = [];
                    obj.forEach(function(element){
                        defn.push(element.text);
                        resolve(defn);
                    })
                }
            }
        })
    })
}

//Method to get word synonyms
function getSynonyms(word){
    let url = "https://fourtytwowords.herokuapp.com/word/"+word+"/relatedWords?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164"
     return new Promise(function(resolve,reject){
         request(url,function(err,res,body){
             if(err){
                reject("There is some problem with API. Try agian after sometime. \n");
             }
             else{
                 let obj = JSON.parse(body);
                 if(obj.error == "word not found"){
                     reject("The word not found in Dictionary");
                 }
                 else{
                     let syn = [];
                     obj.forEach(function(element){
                         if(element.relationshipType == "synonym"){
                             let synonyms = element.words;
                             synonyms.forEach(function(element){
                                 syn.push(element);
                                 resolve(syn);
                             })
                         }
                         else if(obj.length == 1){
                             resolve(syn);
                        }
                     })

                 }
             }
         })
     })
}

//Method to get word antonyms
function getAntonyms(word){
    let url = "https://fourtytwowords.herokuapp.com/word/"+word+"/relatedWords?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164"
    return new Promise(function(resolve,reject){
        request(url,function(err,res,body){
            if(err){
                reject("There is some problem in API. Try again after some time. /n");
                  }
            else{
                    let obj = JSON.parse(body);
                    if(obj.error == "word not found"){
                        reject("The word not found in Dictionary");
                       }
                    else{
                            let ant = [];
                            obj.forEach(function(element){
                                    if(element.relationshipType == "antonym"){
                                            let antonyms = element.words;
                                            antonyms.forEach(function(element){
                                                ant.push(element);
                                                resolve(ant);
                                            })
                                    } 
                                    else if(obj.length == 1){
                                        resolve(ant);
                                    }
                                       

                            })
                    }
            }
        })
    })
}

//Method to get word examples
function getExamples(word){
    let url = "https://fourtytwowords.herokuapp.com/word/"+word+"/examples?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164"
    return new Promise(function(resolve,reject){
        request(url,function(err,res,body){
            if(err){
                reject("There is some problem in API. Try again after some time. /n");
            }
            else{
                let obj = JSON.parse(body);
                    if(obj.error == "word not found"){
                        reject("The word not found in Dictionary")
                    }
                else{
                    let examples = obj.examples;
                        let ex = [];
                        examples.forEach(function(element){
                            ex.push(element.text);
                            resolve(ex);
                        })
                    }  

            }
        })
    })

}

 //Method to get full Dictionary
 async function getFullDict(word){
    var fullDictionary = {}
    try{
        fullDictionary["definitions"] = await getDefinitions(word);
        fullDictionary["synonyms"] = await getSynonyms(word);
        fullDictionary["antonyms"] = await getAntonyms(word);
        fullDictionary["examples"] = await getExamples(word);
        return fullDictionary;
    }
    catch(err){
        console.log(err);
    }
   
}
 
//Method to get Randomword
function getRandomWord(){
    let url = "https://fourtytwowords.herokuapp.com/words/randomWord?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164"
    return new Promise(function(resolve,reject){
        request(url,function(err,res,body){
            if(err){
                reject("There is some problem in API. Try again after some time. /n");
              }
            else{
                let obj = JSON.parse(body);
                let randomWord = obj.word;
                resolve(randomWord);
            }
            
        })
    })
   
}

//Method to get finalResults
function finalResults(word,title,data){
    console.log();
    console.log(title+" of the word "+word+" are:");
    console.log("**********************************");
    if(data == ""){
        console.log("There is no "+title+ "  of the given word");
    }
    else{
        data.forEach(function(element){
            console.log("\t=>  "+element);
        });
    }
   
}



//Method to playGame
function playGame(){
    return new Promise(function(resolve,reject){
       getRandomWord().then((randomWord) => {
           console.log(randomWord)
           getFullDict(randomWord).then((res) => {
               let fullDict = res;
               fullDict["word"] = randomWord;
               console.log(fullDict.definitions[0]);
               fullDict.definitions.push(fullDict.definitions.splice(0,1)[0])
               guessWord(fullDict);
           })

       })
       
    })
}

function guessWord(fullDict){
  inquirer.prompt([{
       type: "input",
       name : "word",
       message:"Guess the word : "
   }])
  .then((answers) => {
      if(answers.word == fullDict.word || fullDict.synonyms.includes(answers.word)){
          console.log("Correct answer");
      }
      else{
          console.log("Wrong answer");
          iterate(fullDict);
      }
  })
}

function iterate(fullDict){
   inquirer.prompt({
       type: "input",
       name: "choice",
       message: 
       "\n1.Try again \n2.Hint \n3.Quit \nPlease enter your choice"
   })
   .then((answers) => {
      console.log(answers.choice); 
      if(answers.choice == 1){
          guessWord(fullDict);
      }
      else if(answers.choice == 2){
         console.log(fullDict.definitions[0]);
         fullDict.definitions.push(fullDict.definitions.splice(0,1)[0])
         guessWord(fullDict);
      }
      else{
          console.log("The correct word is "+ fullDict.word);
          getFullDict(fullDict.word).then((res) => console.log(res));
          //process.exit();
      }
   })
}


//Actions to get word definitions
program
    .command('defn <word>')
    .description('Definition of the word')
    .action((word) => {
        getDefinitions(word)
        .then((defn) => {
           finalResults(word,'Definitions',defn);
        })
        .catch(function(error){
            console.log(error);
        });
});

//Actions to get word Synonyms
program
    .command('syn <word>')
    .description('synonyms of the word')
    .action((word) => {
        getSynonyms(word)
        .then((syn) => {
            finalResults(word,'Synonyms',syn);
        })
        .catch(function(error){
            console.log(error);
        });
    });

//Actions to get word Antonyms
program
    .command('ant <word>')
    .description('antonyms of the word')
    .action((word) => {
        getAntonyms(word)
        .then((ant) => {
          finalResults(word,'Antonyms',ant);
        })
        .catch(function(err){
            console.log(err);
        });
    });

//Actions to get word Examples
program
    .command('ex <word>')
    .description('Examples of the word')
    .action((word) => {
        getExamples(word)
        .then((ex) => {
        finalResults(word,'Examples',ex);
        })
        .catch(function(error){
            console.log(error);
        });
    });


//Actions to get full dictionary
program
.command('*')
.description(' word full dict')
.action(function(word){
    let examples = word.parent.args[0];
    getFullDict(examples)
        .then((fullInfo) =>{
           finalResults(examples,'Definitions',fullInfo.definitions);
           finalResults(examples,'Synonyms',fullInfo.synonyms);
           finalResults(examples,'Antonyms',fullInfo.antonyms);
           finalResults(examples,'Examples',fullInfo.examples);
        })
});

//Actions to get RandomWord
if(process.argv.length <= 2){
    
    getRandomWord().then((randomWord) => {
        console.log();
        console.log(randomWord);
        getFullDict(randomWord).then((res) => {
            finalResults(randomWord,'Definitions',res.definitions);
            finalResults(randomWord,'Synonyms',res.synonyms);
            finalResults(randomWord,'Antonyms',res.antonyms);
            finalResults(randomWord,'Examples',res.examples);
        })
    });
      
} 



//Word game
program
    .command('play')
    .description('Dictionary game')
    .action(() => {
        playGame();
    });


program
    .version('1.1.0')
    .description('Managing the tasks');

program.parse(process.argv);

