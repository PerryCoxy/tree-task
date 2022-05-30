import axios from 'axios';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import TreeMenu from 'react-simple-tree-menu';
import '../node_modules/react-simple-tree-menu/dist/main.css';
import './App.css';

function App() {
  const [item, setItem] = useState('');
  const [content, setContent] = useState(null);
  const [tree, setTree] = useState('');

  useEffect(() => {
    async function getResults() {
      const results = await axios('https://api.github.com/gists/e1702c1ef26cddd006da989aa47d4f62');
      setContent(results.data)
    }
    getResults();
  }, []);

  useEffect(() => {
    let data = [];
    if (content) {
      data = JSON.parse(content.files['view.json'].content).entityLabelPages[0];

      const node = [];

      for (let i = 0; i < data.labels.length; i++) {
        node.push({
          key: data.entityLongIds[i],
          label: data.labels[i],
          parent: data.parentEntityLongIds[i] === -1 ? null : data.parentEntityLongIds[i],
        });
      }

      setTree(buildTree(node));
    }
  },
    [content]
  )

  function buildTree(node) {
    const map = new Map(node.map(item => [item.key, item]));
    for (let item of map.values()) {
      if (!map.has(item.parent)) {
        continue;
      }
      const parent = map.get(item.parent);
      parent.nodes = [...parent.nodes || [], item];
    }
    return [...map.values()].filter(item => !item.parent);
  }

  const handleApplyClick = () => {
    console.log('####: ~ file: App.js ~ line 22 ~ App ~ tree', tree);
  }

  const handleRefreshClick = () => {
    document.location.reload();
  }

  const handleRemoveClick = () => {
    console.log('item', item);
    let filteredTree = _.cloneDeep(tree);
    console.log('####: ~ file: App.js ~ line 64 ~ handleRemoveClick ~ filteredTree', filteredTree);

    const keys = item.key.split('/').map(i => parseInt(i));

    const keysWithoutFirst = keys.splice(1);

    let parentNode = null;
    let indexNode = null;
    let currentNode = filteredTree.find((node, index) => {
      indexNode = index;
      return node.key === keys[0];
    });

    for (const k of keysWithoutFirst) {
      parentNode = currentNode;
      currentNode = currentNode.nodes.find(node => node.key === k)
    }

    const nodeToDelete = currentNode;

    if (parentNode == null) {
      filteredTree = filteredTree.filter(node => node.key !== nodeToDelete.key);
    } else {
      parentNode = parentNode.nodes.filter(node => (node.key !== nodeToDelete.key));
    }

    setTree(filteredTree);
  }

  return (
    <div className="root">
      <div className="tree">
        <TreeMenu
          cacheSearch
          data={tree}
          debounceTime={125}
          disableKeyboard={false}
          hasSearch={false}
          onClickItem={value => setItem(value)}
          resetOpenNodesOnDataUpdate={false}
        />
      </div>
      <div className="wrapper">
        <div className="button__wrapper">
          <button onClick={handleRefreshClick}>Refresh</button>
          <button onClick={handleApplyClick}>Apply</button>
          <button onClick={handleRemoveClick}>Remove</button>
        </div>
        {item && <div className="description">
          <p>Label: {item.label}</p>
          <p>Id: {item.key.split('/').pop()}</p>
          <p>ParentId: {item.parent === null ? '-1' : item.parent}</p>
        </div>}
      </div>
    </div>
  );
}

export default App;