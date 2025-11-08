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

declare module "*.css";
declare module "*.scss";
declare module "*.sass";

interface IChildren {
  children: React.ReactNode;
}
