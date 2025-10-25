declare module "*.png" {
  let value: string;
  export default value;
}

declare module "*.jpg" {
  let value: string;
  export default value;
}

declare module "*.jpeg" {
  let value: string;
  export default value;
}

declare module "*.gif" {
  let value: string;
  export default value;
}

declare module "*.svg?react" {
  import * as React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;

  let value: string;
  export default value;
}

interface IChildren {
  children: React.ReactNode;
}
