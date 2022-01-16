import { motion } from "framer-motion";

const Path = (props: any) => (
  <motion.path
    strokeWidth="2"
    stroke="var(--text-auxiliary)"
    strokeLinecap="round"
    {...props}
  />
);

export const NestedListIndicator = ({ isOpen }: { isOpen: boolean }) => (
  <motion.div
    initial={"closed"}
    animate={isOpen ? "open" : "closed"}
  >
    <svg height="12px" viewBox="0 0 16 16" width="12px">
      <Path
        variants={{
          closed: { d: "M 3 9 L 9 4" },
          open: { d: "M 4 9 L 9 15" },
        }}
      />
      <Path
        variants={{
          closed: { d: "M 3 9 L 9 14" },
          open: { d: "M 14 9 L 9 15" }
        }}
      />
    </svg>
  </motion.div>
)