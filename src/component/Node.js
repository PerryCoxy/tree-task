import { realMap } from '../calculation';

export const Node = ({ entity, level = 0 }) => {
  let levlTag = '';

  for (let i = 0; i <= level; i++) {
    levlTag += '-';
  }

  return (
    <div className="Node__container">
      <p className="Node__label">
        {levlTag}
        {entity.labels}
        {/* {entity.id} */}

        {entity.children.map((childIndex) => (
          <Node entity={realMap[childIndex]} level={level + 1} />
        ))}
      </p>
    </div>
  );
};
