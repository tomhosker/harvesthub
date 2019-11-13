/*
This code contains a class which handles any final, universal touches to the
page before it's passed to the browser.
*/

// The class in question.
class Finaliser
{
  constructor()
  {

  }

  // Render, and deliver the page to the browser.
  protoRender(req, res, view, properties)
  {
    var date = new Date();
    var that = this;

    properties.footstamp = date.toISOString();
    res.render(view, properties, function(err, html){
      if(html === undefined)
      {
        res.render(view, properties);
      }
      else
      {
        html = fixApostrophes(html);
        html = fixDashes(html);
        res.send(html);
      }
    });
  }
}

// A helper function. Ronseal.
fixApostrophes(input)
{
  while(input.indexOf("``") >= 0)
  {
    input = input.replace("``", "&ldquo");
  }
  while(input.indexOf("''") >= 0)
  {
    input = input.replace("''", "&rdquo");
  }
  while(input.indexOf("`") >= 0)
  {
    input = input.replace("`", "&lsquo;");
  }
  while(input.indexOf("'") >= 0)
  {
    input = input.replace("'", "&rsquo;");
  }
  return input;
}

// A helper function. Ronseal.
fixDashes(input)
{
  while(input.indexOf("---") >= 0)
  {
    input = input.replace("---", "&mdash;");
  }
  while(input.indexOf("--") >= 0)
  {
    input = input.replace("--", "&ndash;");
  }
  return input;
}

// Exports.
module.exports = Finaliser;
