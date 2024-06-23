import { Creator } from '../types';

export const creators: Creator[] = [
  {
    id: "1",
    name: "Alice",
    username: "alice123",
    title: "Blockchain Developer",
    image: "/images/alice.png",
    description: "Alice is a highly skilled blockchain developer with extensive experience in building and deploying decentralized applications.",
    templates: ["polkadot-bagpipes-1", "polkadot-ui-1"]
  },
  {
    id: "2",
    name: "Bob",
    username: "bob_dev",
    title: "Smart Contract Engineer",
    image: "/images/bob.png",
    description: "Bob is an expert in smart contract development and has contributed to numerous high-profile blockchain projects.",
    templates: ["ava-bagpipes-2", "ava-ui-2"]
  },
  {
    id: "3",
    name: "Charlie",
    username: "charlie_dev",
    title: "Full Stack Developer",
    image: "/images/charlie.png",
    description: "Charlie is a versatile developer proficient in both front-end and back-end technologies, with a focus on blockchain integrations.",
    templates: ["polkadot-bagpipes-3", "ava-ui-1"]
  },
  // Add more creators as needed...
];
