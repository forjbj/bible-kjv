use wasm_bindgen::prelude::*; //import everything to create library

extern crate serde_json;
extern crate regex;
extern crate rand;

use serde_json::Value as jsonValue;
use serde_json::Value::Null as jsonNull;
use regex::Regex;
use rand::prelude::*;

#[wasm_bindgen(module = "src/app/app.component.ts")]
extern "C" {
    #[wasm_bindgen]
    fn read_file() -> JsValue;
}

#[wasm_bindgen]
pub fn render (test: usize, book: usize, ) -> String {  //need to be string for serde_json to index
    
    let file = read_file();
    let contents: jsonValue = serde_json::from_str(&file.as_string().expect("Can't read json")).unwrap();
    
    if test == 0 && book == 18 { //Psalms selected
        psalms_book(&contents)
    } else {
        not_psalms( test, book, &contents )
    }
}

fn psalms_book(contents:&jsonValue) -> String {
  
    //because of type change from javascript to rust: first Array in Object has the items labelled "0" and "1" (numbers in strings) **CAN'T CHANGE JSON
    //let bible_book = &contents["0"]["books"][18]; //Psalms

    let current = contents["0"]["books"][18]["chapters"].as_array().unwrap();

    let mut result: String = format!("<div class=\"headings\"><h4>THE</h4><h2>BOOK OF PSALMS</h2></div>");
    let mut section: String;

    for psalm in current {
        section = format!("<section><div id =\"0-18-{}\"><div class=\"headings\" >", psalm["chapter"]);

        let psal = format!("<p class=\"fontType\">PSALM {}</p></div>",psalm["chapter"]);
        section.push_str(&psal);

        for verse in psalm["verses"].as_array().unwrap() {
            if verse["ver"] == 1 {
                section.push_str(&format!("<div class=\"psalm fontType\">{}</div>",verse["description"].as_str().unwrap())); //unwrap necessary to remove ""
                section.push_str(&format!("<div id = \"0-18-{0}-1\"><a href = \"../book#0-18-{0}-1\"><p class=\"firstVerse fontType\">{1}</p></a></div>", psalm["chapter"], verse["scr"].as_str().unwrap()));
            } else {     
                if verse["description"] != jsonNull {  // needed for psalm 119
                    section.push_str(&format!("<p class=\"psalm fontType\">{}</p>",verse["description"].as_str().unwrap()));
                }
                section.push_str(&format!("<div id = \"0-18-{0}-{1}\" class = \"verses\"><a href = \"../book#0-18-{0}-{1}\" ><p class=\"verseNumber fontType\">{1}</p></a>
                <a href = \"../book#0-18-{0}-{1}\"><p class = \"scripture fontType\">{2}</p></a></div>", psalm["chapter"], verse["ver"], verse["scr"].as_str().unwrap()));
            }
        }
        if psalm != current.last().unwrap() {
            section.push_str("</div></section><hr>");
        } else {
            section.push_str("</div></section>");
        }
        result.push_str(&section);
    }
    result.push_str("<hr>");
    return result;
}
fn not_psalms( test: usize, book: usize, contents:&jsonValue ) -> String {

    //because of type change from javascript to rust: first Array in Object has the items labelled "0" and "1" (numbers in strings) **CAN'T CHANGE JSON
    let bible_book = &contents[format!("{}", &test)]["books"][&book];

    let current = bible_book["chapters"].as_array().unwrap();
    let mut result: String;
    let mut section: String;
    let title = bible_book["title"].as_str().unwrap();
    result = format!("<div class=\"headings\">{}</div>", title);

    for chapter in current {
        section = format!("<section><div id =\"{}-{}-{}\"><div class=\"headings\" >", &test, &book, chapter["chapter"]);

        let chap = format!("<p class=\"fontType\">CHAPTER {}</p></div>",chapter["chapter"]);
        section.push_str(&chap);

        for verse in chapter["verses"].as_array().unwrap() {
            if verse["ver"] == 1 {
                section.push_str(&format!("<div id = \"{0}-{1}-{2}-1\"><a href = \"../book#{0}-{1}-{2}-1\"><p class=\"firstVerse fontType\">{3}</p></a></div>", &test, &book, chapter["chapter"], verse["scr"].as_str().unwrap()));
            } else {     
                section.push_str(&format!("<div id = \"{0}-{1}-{2}-{3}\" class = \"verses\"><a href = \"../book#{0}-{1}-{2}-{3}\" ><p class=\"verseNumber fontType\">{3}</p></a>
                <a href = \"../book#{0}-{1}-{2}-{3}\"><p class = \"scripture fontType\">{4}</p></a></div>", &test, &book, chapter["chapter"], verse["ver"], verse["scr"].as_str().unwrap()));
            }
        }
        if chapter != current.last().unwrap() {
            section.push_str("</div></section><hr>");
        } else {
            section.push_str("</div></section>");
        }
        result.push_str(&section);
    }
    if bible_book["note"] != jsonNull {
        let note =  format!("<hr><br><div class = \"notes\">{}</div><br><hr>", bible_book["note"].as_str().unwrap());
        result.push_str(&note);
    } else {
        result.push_str("<hr>");
    }
    return result;
}

#[wasm_bindgen]
pub fn search (searches: usize, inp: String, acc: usize) -> String {
    let mut i: u8;
    let j: u8;
    match searches {
        0 => {
            i = 0; // Old testament search only
            j = 1; // Stop while loop '< j'
        }
        1 => {
            i = 1; // New testament search only
            j = 2;
        }
        _ => {
            i = 0; // Old and New testament search
            j = 2;
        }
    }

    let file = read_file();
    let contents: jsonValue = serde_json::from_str(&file.as_string().expect("Can't read json")).unwrap();

    let mut results: String = "<br>".to_string();

    let re = Regex::new(r"[[:alpha:]]+").unwrap(); // only words to search for
    let inp_search = &inp.to_lowercase();
    let mut word_ind: Vec<&str> = re.find_iter(&inp_search).map(|m| m.as_str()).collect();
    let word_ind_out: Vec<&str> = re.find_iter(&inp).map(|m| m.as_str()).collect(); // input search terms minus any html for result statement
    let inp_str: String = word_ind_out.join(" ");
    word_ind.sort();
    word_ind.dedup(); // deduplicate after sorting removes duplicate words.
    if word_ind.is_empty() || (word_ind[0].chars().count() < 2 && word_ind[0].len() == word_ind.capacity()) { //return if search request invalid
        //return the string and finish
        return "<div class = \"alert\">Search query must have a minimum of 2 characters</div>".to_string();
    } 

    let mut search_num = 0;
    while i < j {
        let json_bible = contents[format!("{}", i)]["books"].as_array().unwrap();
        for (j, books) in json_bible.iter().enumerate() {
            for chapters in books["chapters"].as_array().unwrap() {
                for verses in chapters["verses"].as_array().unwrap() {
                    let mut selected = String::from(verses["scr"].as_str().unwrap());
                    let select = &selected.to_lowercase();
                    let mut counted = 0; 
                    for word in word_ind.iter() { //check all words are in the scripture
                        if select.contains(word) { //find everything regardless of case
                            if acc == 0 { //only count if accuracy is contains
                                counted = counted +1;
                            } else { // only count word if exact match
                                if word == &"i" { // have to change 'i' from search as it finds the <i> tag; change to capital 'I'
                                    let re = Regex::new(&format!("\\b{}\\b", "I")).unwrap();
                                    if re.is_match(&selected) { //search in original case not 'select'
                                        counted = counted +1;
                                    }
                                } else {
                                    let re = Regex::new(&format!("\\b{}\\b", &word.to_lowercase())).unwrap();
                                    if re.is_match(&select) {
                                        counted = counted +1;
                                    }
                                }
                            }
                        } 
                    }
                    if counted == word_ind.len() { // find location of words
                        //let mut highlight_insert = Vec::new();
                        for word in word_ind.iter() {
                            if word == &"i" { // have to remove 'i' from highlight as it highlights the <i> tag; change to capital 'I'
                            let select = selected.clone();//not sure why this is necessary; complier complains without it    
                            let re = Regex::new(&format!("\\b{}\\b", "I")).unwrap();
                                if re.is_match(&select) {
                                    let mat = re.find(&select).unwrap(); //search in original case
                                    selected.replace_range(mat.end()..mat.end(), "</span>"); //end first
                                    selected.replace_range(mat.start()..mat.start(), "<span class=\"highlight\">");
                                }
                            } else {
                                let re = Regex::new(&format!("\\b{}\\b", &word)).unwrap();
                                if re.is_match(&selected.to_lowercase()) {
                                    let select = &selected.to_lowercase();
                                    let mat = re.find(&select).unwrap();
                                    selected.replace_range(mat.end()..mat.end(), "</span>"); //end first
                                    selected.replace_range(mat.start()..mat.start(), "<span class=\"highlight\">");
                                }
                            }
                        }
            
                        results.push_str(&format!("<div id = \"{0}-{1}-{3}-{4}\" class = \"listResults\"><a href = \"../book#{0}-{1}-{3}-{4}\">
                        <p class=\"bookResults\">{2} {3}:{4}</p></a><a href = \"../book#{0}-{1}-{3}-{4}\"><p class = \"scrResults\">{5}</p></a></div>", 
                        i, j ,books["bookName"].as_str().unwrap(),chapters["chapter"], verses["ver"], selected));// extract route from id - see javascript, search component; angular stops routing from innerhtml
                        search_num += 1;
                    }
                }
            }
        }
        i = i + 1;
    }
    
    let mut results_fin: String;
                
    match search_num {
        0 => {
            results_fin = format!("<div>There are no results for \"{}\".<br><br>Please check the spelling, or try part of a word with the 'Accuracy' set to 'Contains'.</div>", inp_str);
        },
        1 => {
            results_fin = format!("<div>There is a Search Result For \"{}\":</div><br>", inp_str);
            },
        _ => {            
            results_fin = format!("<div>There are {} Search Results For \"{}\":</div><br>",search_num, inp_str);
            },
    }
    results_fin = results_fin + &results;

    return results_fin;
}

#[wasm_bindgen]
pub fn render_widget() -> String {  //need to be string for serde_json to index
    // random generate book
    let mut test_rng = thread_rng();
    let test: usize = test_rng.gen_range(0..2); // excludes higher number
    let book: usize;
    if test == 0 {
        let mut book_rng = thread_rng();
        book = book_rng.gen_range(0..39);
    } else {
        let mut book_rng = thread_rng();
        book = book_rng.gen_range(0..27);
    }

    let mut result: String;
    let psalms: bool;
    if test == 0 && book == 18 { // use this to check input array values against Psalms for section rendering
        psalms = true; 
    } else {
        psalms = false;
    }

    let file = read_file();

    let contents: jsonValue = serde_json::from_str(&file.as_string().expect("Can't read json")).unwrap();

    //because of type change from javascript to rust: first Array in Object has the items labelled "0" and "1" (numbers in strings) **CAN'T CHANGE JSON
    let bible_book = &contents[format!("{}", &test)]["books"][&book];

    let current = bible_book["chapters"].as_array().unwrap();
    let num_chapters = current.len();
    let mut chap_rng = thread_rng();
    let chap = chap_rng.gen_range(0..num_chapters);

    result = format!("<section class = \"head\" id =\"{}-{}-{}\">", test, book, chap);

    let chapter = &current[chap];
    for verse in chapter["verses"].as_array().unwrap() {
        if verse["ver"] == 1 {
            if psalms {
                let desc = format!("<p class=\"psalm fontType\">{}</p>", verse["description"].as_str().unwrap()); //unwrap necessary to remove ""
                result.push_str(&desc);
            };
            let first = format!("<div id = \"1\"><p class=\" ver firstVerse fontType\">{}</p></div>", verse["scr"].as_str().unwrap());
            result.push_str(&first);
        } else {     
            if psalms {               // needed for psalm 119
                if verse["description"] != jsonNull {
                    let desc = format!("<p class=\"psalm fontType\">{}</p>",verse["description"].as_str().unwrap()); //unwrap necessary to remove ""
                    result.push_str(&desc);
                }
            }
            let script = format!("<div id = \"{0}\"  class = \"ver verses\"><p class=\"verseNumber fontType\">{0}</p>
                                    <p class = \"scripture fontType\">{1}</p></div>", verse["ver"], verse["scr"].as_str().unwrap());
            result.push_str(&script);
        }
    }

    if bible_book["note"] != jsonNull && chapter == current.last().unwrap(){
        let note =  format!("<br><div class = \"notes\">{}</div></section>", bible_book["note"].as_str().unwrap());
        result.push_str(&note);
    } else {
        result.push_str("</section>")
    }

    return result;
}