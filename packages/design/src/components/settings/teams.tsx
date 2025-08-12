import { useLayoutEffect, useState } from "react";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const roles = [
  {
    role: "admin",
    permission:
      "The Administrator is the top-level user responsible for managing the platform’s users, settings, and operations.",
    users: [
      {
        name: "John Doe",
        avatar: "https://github.com/evilrabbit.png",
      },
      {
        name: "John Doe",
        avatar: "https://github.com/leerob.png",
      },
      {
        name: "Iron Man",
        avatar: "",
      },
      {
        name: "Mary Moe",
        avatar: "https://github.com/shadcn.png",
      },
      {
        name: "John Doe",
        avatar: "",
      },
    ],
  },
  {
    role: "doctor",
    permission:
      "The doctor is the mid-level user responsible for managing patients appointments, scheduling appointments, and prescribing medications.",
    users: [
      {
        name: "John Doe",
        avatar: "https://github.com/leerob.png",
      },
      {
        name: "Iron Man",
        avatar: "",
      },
      {
        name: "John Doe",
        avatar: "https://github.com/evilrabbit.png",
      },
      {
        name: "Mary Moe",
        avatar: "https://github.com/shadcn.png",
      },
      {
        name: "John Doe",
        avatar: "",
      },
    ],
  },
  {
    role: "staff",
    permission:
      "The staff is the user responsible for managing the platform’s patients check-ins, processing payments, and viewing patient info.",

    users: [
      {
        name: "John Doe",
        avatar: "https://github.com/leerob.png",
      },
      {
        name: "John Doe",
        avatar: "https://github.com/evilrabbit.png",
      },
      {
        name: "John Doe",
        avatar: "",
      },
      {
        name: "Mary Moe",
        avatar: "https://github.com/shadcn.png",
      },
      {
        name: "Iron Man",
        avatar: "",
      },
    ],
  },
];

type EditStateType = Omit<(typeof roles)[0], "users" | "">;

export function Teams() {
  const [pageState, setPageState] = useState<"default" | "edit" | "create">(
    "default",
  );

  const [editStateInfo, setEditStateInfo] = useState<EditStateType | undefined>(
    undefined,
  );

  useLayoutEffect(() => {
    setPageState("default");
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      >
        {pageState !== "default" && (
          <Button
            variant={"secondary"}
            className="mb-7 rounded-xl"
            onClick={() => setPageState("default")}
          >
            <ChevronLeft /> Go Back
          </Button>
        )}

        {pageState === "default" && (
          <section>
            <div className="flex flex-col gap-5">
              {roles.map(({ role, permission, users }, index) => (
                <div
                  key={index}
                  className="bg-primary/5 flex items-center gap-2 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 flex-col flex-wrap">
                      <h3 className="text-xs font-semibold capitalize">
                        {role}
                      </h3>
                      <p className="text-foreground/70 text-xs">{permission}</p>
                    </div>

                    <div className="flex flex-row-reverse">
                      {users
                        .toReversed()
                        .slice(0, 4)
                        .map((user, index) => (
                          <Avatar
                            key={index}
                            className={
                              "border-2 border-slate-50 not-first:-mr-4"
                            }
                          >
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-primary/10 uppercase backdrop-blur-3xl">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                    </div>
                  </div>

                  <Button
                    aria-label={"Edit " + role + " roles"}
                    variant={"ghost"}
                    className="border-secondary border-b"
                    onClick={() => {
                      setEditStateInfo({ role, permission });
                      setPageState("edit");
                    }}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex">
              <Button
                className="mt-4 ml-auto rounded-xl"
                onClick={() => {
                  setPageState("create");
                }}
              >
                <PlusIcon /> Create Role
              </Button>
            </div>
          </section>
        )}

        {pageState === "edit" && (
          <section>
            <div className="flex"></div>
          </section>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
