// Afficher date et heure -----------------------------------------------------------------------
function date_heure() { 
	let now = new Date();
	let annee = now.getFullYear();
	let mois = ('0' + (now.getMonth() + 1)).slice(-2);
	let jour = ('0' + now.getDate()).slice(-2);
	let heure = ('0' + now.getHours()).slice(-2);
	let minute = ('0' + now.getMinutes()).slice(-2);
	let seconde = ('0' + now.getSeconds()).slice(-2);
	document.getElementById("date-heure").innerHTML = 
		"Nous sommes le " + jour + "/" + mois + "/" + annee + " et il est " + heure + "h " + minute + "min " + seconde + "s.";
}
 
// Mettre en majuscules -----------------------------------------------------------------------
function maj() {
	let text = document.getElementById("holder1").innerText;
	document.getElementById("holder1").innerHTML = text.toUpperCase();
}

// Afficher / Masquer aboutme -----------------------------------------------------------------------
function showHide_aboutme() {
	let div = document.getElementById("aboutme");
	let b = document.getElementById("button_aboutme").innerHTML;
	if (div.style.display === "none") {
		div.style.display = "block";
		let change = b.replace("more", "less");
		document.getElementById("button_aboutme").innerHTML = change;
	} else {
		div.style.display = "none";
		let change = b.replace("less", "more");
		document.getElementById("button_aboutme").innerHTML = change;
	}
}

/*------------------------------------------------------------------------------------------------------------------*/
//							OUTIL D'ANALYSE des données dans un fichier									//
/*------------------------------------------------------------------------------------------------------------------*/

// Charger le texte -----------------------------------------------------------------------
// Global variables
let global_var_tokens = [];
let global_var_lines = [];

// Charger le texte -----------------------------------------------------------------------
window.onload = function () {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function () {
        let file = fileInput.files[0];
        let textType = new RegExp("text.*");

        if (file.type.match(textType)) {
            let reader = new FileReader();

            reader.onload = function () {
                fileDisplayArea.innerText = reader.result;
                segText();
                let nbTokens = global_var_tokens.length;
                let nbLines = global_var_lines.length;
                document.getElementById("logger2").innerHTML = '<span class="infolog">Nombre de tokens : ' + nbTokens + '<br>Nombre de lignes : ' + nbLines + ' </span>';
            }

            reader.readAsText(file);
            document.getElementById("logger1").innerHTML = '<span class="infolog">Fichier chargé avec succès</span>';
        } else {
            fileDisplayArea.innerText = "";
            document.getElementById("logger1").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });
};

// Afficher / Masquer l'aide --------------------------------------------------------------------------
function showHide_aide() {
    let div = document.getElementById("aide");
    let b = document.getElementById("button_aide").innerHTML;
    if (div.style.display === "none") {
        div.style.display = "block";
        document.getElementById("button_aide").innerHTML = "Masquer l'aide";
    } else {
        div.style.display = "none";
        document.getElementById("button_aide").innerHTML = "Afficher l'aide";
    }
}

// VERSION segText() ------------------------------------------------------------------------
function segText() {
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
    } else {
        if (document.getElementById("delimID").value === "") {
            document.getElementById("logger3").innerHTML = '<span class="errorlog">Aucun délimiteur donné !</span>';
        } else {
            document.getElementById('logger3').innerHTML = "";
            let text = document.getElementById("fileDisplayArea").innerText;
            let delim = document.getElementById("delimID").value;
            let display = document.getElementById("fileDisplayArea");

            let regex_delim = new RegExp("[" + delim.replace("-", "\\-").replace("[", "\\[").replace("]", "\\]") + "\\s]+");

            let tokens = text.split(regex_delim).filter(x => x.trim() != "");
            let lines = text.split(/\r?\n/).filter(line => line.trim() != "");

            global_var_tokens = tokens;
            global_var_lines = lines;
            display.innerHTML = tokens.join(" ");
        }
    }
}

// GREP ---------------------------------------------------------------------
function grep() {
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML = "";
        let poleInput = document.getElementById("poleID").value;
        if (poleInput === "") {
            document.getElementById('logger3').innerHTML = "Il faut d'abord entrer un pôle !";
        } else {
            let poleRegex = new RegExp(poleInput, 'gi');
            let resultat = "<tr><th>Ligne</th><th>Résultat</th></tr>";
            for (let i = 0; i < global_var_lines.length; i++) {
                if (poleRegex.test(global_var_lines[i])) {
                    let lineNumber = i + 1;
                    resultat += `<tr><td>${lineNumber}</td><td>${global_var_lines[i]}</td></tr>`;
                }
            }
            if (resultat === "<tr><th>Ligne</th><th>Résultat</th></tr>") {
                document.getElementById('page-analysis').innerHTML = "";
                document.getElementById('logger3').innerHTML = "Aucune correspondance trouvée.";
            } else {
                document.getElementById('logger3').innerHTML = "";
                document.getElementById('page-analysis').innerHTML = "<table border='1'>" + resultat + "</table>";
            }
        }
    }
}

function dictionnaire() {
    if (document.getElementById('fileDisplayArea').innerHTML == "") {// innerHTML permet ici de récupérer le contenu HTML (c'est-à-dire le texte affiché)
                                                                      // dans la zone 'fileDisplayArea'. On vérifie s'il est vide pour savoir si l'utilisateur
                                                                      // a bien chargé un fichier texte avant d'exécuter l'analyse.
                                                                      // Si innerHTML est vide (""), cela signifie qu'aucun texte n'a été chargé.
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML = "";
        let tokenFreq = {}; // On initialise un objet vide appelé tokenFreq.
                            // Il servira à stocker la fréquence de chaque token (mot ou symbole) trouvé dans le texte.
                            // La clé sera le token, et la valeur sera le nombre de fois qu'il apparaît.
        let tokens = global_var_tokens;  // On récupère la liste des tokens (mots ou unités de texte) depuis une variable globale.
                                         // Cette variable global_var_tokens contient déjà les tokens extraits du texte chargé.

        tokens.forEach(token => tokenFreq[token] = (tokenFreq[token] || 0) + 1);
        let freqPairs = Object.entries(tokenFreq);
        freqPairs.sort((a, b) => b[1] - a[1]); // tri décroissant

        let tableArr = [['<b>Token</b>', '<b>Fréquence</b>']];
        let tableData = freqPairs.map(pair => [`<td>${pair[0]}</td>`, `<td>${pair[1]}</td>`]);
        let finalTable = tableArr.concat(tableData);

        let tableHtml = finalTable.map(row => '<tr>' + row.join('') + '</tr>').join('');
        document.getElementById('page-analysis').innerHTML = '<table>' + tableHtml + '</table>';
    }
}

function concord() {
    if (document.getElementById('fileDisplayArea').innerHTML == "") { 
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML = "";
        let poleInput = document.getElementById('motif').value;
        if (poleInput == "") {
            document.getElementById('logger3').innerHTML = "Il faut d'abord entrer un pôle !";
        } else {
            let lgInput = document.getElementById('lgID').value;
            if (lgInput == "" || parseInt(lgInput) <= 0) {
                document.getElementById('logger3').innerHTML = "Il faut d'abord entrer une longueur > 0 !";
            } else {
                let poleRegex = new RegExp("^" + poleInput + "$", "gi");
                let long = parseInt(lgInput);

                let concordance = global_var_tokens.reduce((acc, token, i) => {
                    if (poleRegex.test(token)) {
                        let cLeft = global_var_tokens.slice(Math.max(0, i - long), i).join(" ");
                        let cRight = global_var_tokens.slice(i + 1, i + 1 + long).join(" ");
                        acc.push([cLeft, token, cRight]);
                    }
                    return acc; // On retourne l'accumulateur à chaque itération pour qu'il soit transmis à l'étape suivante
                }, []);

                let table = document.createElement("table");
                table.innerHTML = "<thead><tr><th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th></tr></thead>";
                concordance.forEach(([cLeft, pole, cRight]) => {  // Pour chaque triplet [contexte gauche, mot cible (pôle), contexte droit]
                    let row = table.insertRow();
                    row.innerHTML = `<td>${cLeft}</td><td><b>${pole}</b></td><td>${cRight}</td>`;
                });

                if (concordance.length === 0) {
                    document.getElementById('page-analysis').innerHTML = "";
                    document.getElementById('logger3').innerHTML = "Aucune concordance trouvée.";
                } else {
                    document.getElementById('logger3').innerHTML = "";
                    document.getElementById("page-analysis").innerHTML = "";
                    document.getElementById("page-analysis").appendChild(table);
                }
            }
        }
    }
}
function nbPhrases() {
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML = "";
        let text = document.getElementById("fileDisplayArea").innerText;
        let phrases = text.split(/[.!?]/).filter(p => p.trim().length > 0);
        let resultat = phrases.length;
        document.getElementById('page-analysis').innerHTML = '<div>Il y a ' + resultat + ' phrases dans ce texte.</div>';
    }
}
function tokenLong() {
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML = "";
        let tokenSort = [...new Set(global_var_tokens)].sort((a, b) => b.length - a.length).slice(0, 10);
        let map = tokenSort.map(token => '<tr><td>' + token + '</td><td>' + token.length + '</td></tr>').join('');
        let resultat = '<table><tr><th colspan=2><b>Mots les plus longs</b></th></tr><tr><th><b>Mot</b></th><th><b>Longueur</b></th></tr>' + map + '</table>';
        document.getElementById('page-analysis').innerHTML = resultat;
    }
}
function pieChart() {
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML = "";
        var stopwordInput = document.getElementById('stopwords').value.toLowerCase();
        var stopwords = stopwordInput.split(",").map(sw => sw.trim());

        var filteredTokens = global_var_tokens.filter(token => !stopwords.includes(token.toLowerCase()));
        var count = {};
        filteredTokens.forEach(token => {
            count[token] = (count[token] || 0) + 1;
        });

        var chartData = [];
        var sortedTokens = Object.keys(count).sort((a, b) => count[b] - count[a]).slice(0, 30);
        sortedTokens.forEach(token => {
            chartData.push({
                label: token,
                y: count[token]
            });
        });

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            backgroundColor: "transparent",
            title: {
                text: "Mots les plus fréquents"
            },
            data: [{
                type: "pie",
                showInLegend: true,
                legendText: "{label}",
                indexLabelFontSize: 14,
                indexLabel: "{label} - {y}",
                dataPoints: chartData
            }]
        });

        chart.render();
    }
}
function kujuj() {
    if (!global_var_tokens || global_var_tokens.length === 0) {
        document.getElementById('logger3').innerHTML = "Veuillez d'abord charger un fichier .txt !";
    } else {
        alert("C'est une plaisanterie !");
        let kujujTokens = global_var_tokens.map(token => token + "uj");
        let kujujText = kujujTokens.join(" ");
        document.getElementById("fileDisplayArea").innerHTML = kujujText;
        document.getElementById("logger3").innerHTML = "<p>Texte transformé avec suffixe 'uj'</p>";
    }
}

// créez une nouvelle fonction à appliquer sur le texte chargé, ainsi que son bouton correspondant qui devra s'afficher entre les boutons "GREP" et "concordancier" de la page web
// exemples : compter les nombres de caractères du texte, afficher un autre type de graphe, faire ressortir en output tous les mots qui commencent avec une majuscule...
// NB j'utiliserai le fichier essai.txt (disponible sur icampus) pour tester vos fonctionnalités (boutons). 
//Vous disposez également d'une série de captures d'écran qui montrent les résultats des différentes fonctionnalités (dossier boutons sur iCampus)  