/*
This code contains a class which handles any final, universal touches to the
page before it's passed to the browser.
*/

// The class in question.
class Finaliser
{
  constructor()
  {
    this.anInteger = 0;
  }

  // Ronseal.
  fixApostrophes(input)
  {
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

  // Ronseal.
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

  // Render, and deliver the page to the browser.
  protoRender(req, res, view, properties)
  {
    var date = new Date();
    properties.footstamp = date.toISOString();
    res.render(view, properties);
  }
}

// Exports.
module.exports = Finaliser;
