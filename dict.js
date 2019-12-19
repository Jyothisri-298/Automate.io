const program = require('commander');
const prompt = require('inquirer');
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
                    obj.forEach(function(element){
                        //console.log(element.text);
                        console.log(element.text);
                        resolve();
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
                     obj.forEach(function(element){
                         if(element.relationshipType == "synonym"){
                             let synonyms = element.words;
                             synonyms.forEach(function(element){
                                 console.log(element);
                                 resolve();
                             })
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
                            obj.forEach(function(element){
                                    if(element.relationshipType == "antonym"){
                                            let antonyms = element.words;
                                            antonyms.forEach(function(element){
                                                console.log(element);
                                                resolve();
                                            })
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
                        examples.forEach(function(element){
                            console.log(element.text);
                            console.log();
                            resolve();
                        })
                    }  

            }
        })
    })

}

//Actions for word definitions
program
    .command('defn <word>')
    .description('Definition of the word')
    .action((word) => {
        getDefinitions(word).catch(function(error){
            console.log(error);
        });
});

//Actions for word Synonyms
program
    .command('syn <word>')
    .description('synonyms of the word')
    .action((word) => {
        getSynonyms(word).catch(function(error){
            console.log(error);
        });
    });

//Actions for word Antonyms
program
    .command('ant <word>')
    .description('antonyms of the word')
    .action((word) => {
        getAntonyms(word).catch(function(err){
            console.log(err);
        });
    });

//Actions for word Examples
program
    .command('ex <word>')
    .description('Examples of the word')
    .action((word) => {
        getExamples(word).catch(function(error){
            console.log(error);
        });
    });

//Actions for full dictionary
program
    .command('*')
    //.option('<word>')
    .description(' word full dict')
    .action(function(word){
        let examples = word.parent.args[0];
    });

if(process.argv.length <= 2){
    let url = "https://fourtytwowords.herokuapp.com/words/randomWord?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164"
    request(url,function(err,res,body){
        let obj = JSON.parse(body);
        let randomWord = obj.word;
        console.log(randomWord);

    })
}



//Word game
program
    .command('play')
    .description('Dictionary game')
    .action(() => {});


program
    .version('1.1.0')
    .description('Managing the tasks');

program.parse(process.argv);

