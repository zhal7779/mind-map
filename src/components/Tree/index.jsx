import React, { useState } from "react";
import * as S from "../MindMapTree/styles";

const Tree = () => {
  const [tree, setTree] = useState({
    title: "root",
    node: 0,
    parentNode: null,
    childNode: [],
  });

  const [nodeValue, setNodeValue] = useState(1);

  function addNode(parentNode) {
    const updateTree = (currentNode, level) => {
      if (currentNode.node === parentNode) {
        const newNode = {
          title: `level${level} - node${nodeValue}`,
          node: nodeValue,
          parentNode: parentNode,
          childNode: [],
        };

        return {
          ...currentNode,
          childNode: [...currentNode.childNode, newNode],
        };
      }

      return {
        ...currentNode,
        childNode: currentNode.childNode.map((child) =>
          updateTree(child, level + 1)
        ),
      };
    };

    setTree((prevTree) => updateTree(prevTree, 1));
    setNodeValue((prevValue) => prevValue + 1);
  }

  const TreeNode = ({ node, level, xPos }) => {
    const handleClick = (e) => {
      addNode(node.node);
      e.stopPropagation();
    };

    return (
      <S.Node
        style={{ marginLeft: xPos }}
        className="node"
        onClick={handleClick}
      >
        <S.NodeText>{node.title}</S.NodeText>

        {node.childNode && node.childNode.length > 0 && (
          <S.NodeContent>
            {node.childNode.map((child, index) => (
              <React.Fragment key={child.node}>
                {index > -1 && <S.Line />}
                <TreeNode node={child} level={level + 1} xPos={xPos + 7} />
              </React.Fragment>
            ))}
          </S.NodeContent>
        )}
      </S.Node>
    );
  };

  return (
    <S.Wrapper>
      <TreeNode node={tree} level={1} xPos={0} />
    </S.Wrapper>
  );
};

export default Tree;
