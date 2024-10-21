// build time tests for graphviz plugin
// see http://mochajs.org/

(function() {
  const graphviz = require('../client/graphviz'),
        expect = require('expect.js');
  const federation = {
    'fed.wiki': {
      'that-page': {
        title: 'That Page',
        story: [{type:'paragraph',text:'Hello Word'}]
      }
    }
  }
  const probe = (site,slug) => {
    console.log('probe',{site,slug})
    return federation[site][slug]
  }

  describe('graphviz algorithmic drawing', () => {

    describe('tree', () => {
      it('can nest one line', () => {
        var result = JSON.stringify(graphviz.tree(['HERE'],[],0));
        return expect(result).to.be(JSON.stringify(['HERE']));
      });
      it('can nest indented lines', () => {
        var result = JSON.stringify(graphviz.tree(['HERE',' THERE'],[],0));
        return expect(result).to.be(JSON.stringify(['HERE',['THERE']]));
      });
      it('can nest in and out again', () => {
        var result = JSON.stringify(graphviz.tree(['HERE',' THERE','THEN'],[],0));
        return expect(result).to.be(JSON.stringify(['HERE',['THERE'],'THEN']));
      });
    });

    describe('evalTree', () => {
      const page = {
        title:'This Page',
        story:[{type:'Paragraph',text:'[[That Page]]'}],
        journal:[]}
      var context = {
        probe,
        name: page.title,
        site: 'fed.wiki',
        page,
        want: page.story.slice()
      }
      it('can pass dot markup', async () => {
        const result = await graphviz.evalTree(['node [shape=box]'],context,[])
        return expect(result[0]).to.be('node [shape=box]');
      });

      it('can display a node', async () => {
        const result = await graphviz.evalTree(['HERE NODE'],context,[])
        return expect(result[0]).to.be('"This\nPage"');
      });

      it('can display linked to nodes', async () => {
        const result = await graphviz.evalTree(['HERE NODE',['LINKS HERE -> NODE']],context,[])
        return expect(result[1]).to.be('"This\nPage" -> "That\nPage"');
      });

      it('can display linkd nodes', async () => {
        const result = await graphviz.evalTree(['HERE',['LINKS',['HERE NODE']]],context,[])
        return expect(result[0]).to.be('"That\nPage"');
      });

    });


  });

}).call(this);

