import React from "react";

const HEBREW_TERMS = [
  "Hebron", "Hermon", "Mamre", "Beelzebub", "Megiddo", "Sak", 
  "Dan", "Aviel", "Kasha", "Dagon", "Astarte", "El", "Mot",
  "Peleset", "Zuna", "Ekron", "Shechem", "Ebal", "Gerizim", "Bethel", "Shiloh", "Lebonah", "Jezreel",
  "Yah-Vah", "Yahweh"
];

export default function Tokenizer({ text, isFirst = false }: { text: string; isFirst?: boolean }) {
  // Split text by words and punctuation, keeping whitespace
  const tokens = text.split(/([\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*|[^\p{L}\p{M}\s]+|\s+)/gu).filter(Boolean);

  let hasFoundFirstLetter = false;

  return (
    <>
      {tokens.map((token, idx) => {
        // If token is just whitespace, render it directly
        if (/^\s+$/.test(token)) {
          return <React.Fragment key={idx}>{token}</React.Fragment>;
        }

        // Check if it's a biblical term (case-insensitive match for flexibility, but usually capitalized)
        const isHebrew = HEBREW_TERMS.some(t => t.toLowerCase() === token.toLowerCase());

        const isWord = /[\p{L}\p{M}]/u.test(token);

        let className = "";
        if (isWord) {
          className += "kinetic-word ";
        }
        if (isHebrew) {
          className += "font-hebrew ";
        }

        if (isFirst && isWord && !hasFoundFirstLetter) {
          hasFoundFirstLetter = true;
          // Split the first word into the first letter and the rest
          const firstChar = token.charAt(0);
          const restOfWord = token.slice(1);
          
          // Bionic split for rest of word
          const bionicIndex = Math.ceil(restOfWord.length / 2);
          const bionicPart = restOfWord.slice(0, bionicIndex);
          const tailPart = restOfWord.slice(bionicIndex);
          
          return (
            <span key={idx} className={className.trim()}>
              <span className="drop-cap">{firstChar}</span>
              <span className="bionic-bold font-medium">{bionicPart}</span>
              <span className="bionic-tail opacity-90">{tailPart}</span>
            </span>
          );
        }

        if (className) {
          if (isWord) {
             const bionicIndex = Math.ceil(token.length / 2);
             const bionicPart = token.slice(0, bionicIndex);
             const tailPart = token.slice(bionicIndex);
             return (
               <span key={idx} className={className.trim()}>
                 <span className="bionic-bold font-medium">{bionicPart}</span>
                 <span className="bionic-tail opacity-90">{tailPart}</span>
               </span>
             );
          }
          return (
            <span key={idx} className={className.trim()}>
              {token}
            </span>
          );
        }

        return <React.Fragment key={idx}>{token}</React.Fragment>;
      })}
    </>
  );
}
