//! This Temporal file would house all our dummy data.
//! This would be replaced by actual data fetched from the backend in a real-world scenario.

export const dentistSample = [
  {
    id: 1,
    name: "josh keneddy",
    avatar: "https://github.com/shadcn.png",
    startDate: "2023-08-25",
  },
  {
    id: 2,
    name: "princewill maximillian",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=PM",
    startDate: "2021-05-12",
  },
  {
    id: 3,
    name: "ebere adeotun",
    avatar: "https://github.com/evilrabbit.png",
    startDate: "2022-03-04",
  },
  {
    id: 4,
    name: "john doe",
    avatar: "https://github.com/shadcn.png",
    startDate: "2020-07-19",
  },
  {
    id: 5,
    name: "harry simmons",
    avatar: "https://github.com/leerob.png",
    startDate: "2023-01-20",
  },
  {
    id: 6,
    name: "beatrice salvador",
    avatar: "https://github.com/evilrabbit.png",
    startDate: "2021-09-08",
  },
  {
    id: 7,
    name: "joy madueke",
    avatar: "https://github.com/leerob.png",
    startDate: "2022-11-15",
  },
  {
    id: 8,
    name: "santiago de-lima",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=SDL",
    startDate: "2023-04-30",
  },
  {
    id: 9,
    name: "tola oluwatosin",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=TO",
    startDate: "2020-06-22",
  },
  {
    id: 10,
    name: "kvicha belmond kvarakeslia",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=KBK",
    startDate: "2023-07-07",
  },
];

export const colorClasses = [
  {
    stickerColor:
      "bg-blue-50 dark:bg-blue-700 text-foreground dark:text-background",
    lineColor: "bg-blue-700 dark:bg-blue-50",
  },
  {
    stickerColor:
      "bg-lime-50 dark:bg-lime-700 text-foreground dark:text-background",
    lineColor: "bg-lime-700 dark:bg-lime-50",
  },
  {
    stickerColor:
      "bg-orange-50 dark:bg-orange-700 text-foreground dark:text-background",
    lineColor: "bg-orange-700 dark:bg-orange-50",
  },
  {
    stickerColor:
      "bg-red-50 dark:bg-red-700 text-foreground dark:text-background",
    lineColor: "bg-red-700 dark:bg-red-50",
  },
  {
    stickerColor:
      "bg-amber-50 dark:bg-amber-700 text-foreground dark:text-background",
    lineColor: "bg-amber-700 dark:bg-amber-50",
  },
  {
    stickerColor:
      "bg-green-50 dark:bg-green-700 text-foreground dark:text-background",
    lineColor: "bg-green-700 dark:bg-green-50",
  },
];

const getRandomColor = () =>
  colorClasses[Math.floor(Math.random() * colorClasses.length)];

export const dummyAppointments = [
  {
    id: 1,
    dentistId: 1,
    patientName: "victor osimhen",
    startTime: "08:00",
    endTime: "10:15",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date().toISOString().slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 2,
    dentistId: 2,
    patientName: "Sarah Johnson",
    startTime: "09:00",
    endTime: "10:00",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date().toISOString().slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 3,
    dentistId: 1,
    patientName: "Mike Wilson",
    startTime: "14:00",
    endTime: "15:30",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date().toISOString().slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 4,
    dentistId: 3,
    patientName: "Emma Davis",
    startTime: "11:00",
    endTime: "12:00",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date().toISOString().slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 5,
    dentistId: 1,
    patientName: "Ikay Gundogan",
    startTime: "12:00",
    endTime: "14:00",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date().toISOString().slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 6,
    dentistId: 4,
    patientName: "Ikay Gundogan",
    startTime: "12:00",
    endTime: "13:55",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date().toISOString().slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 7,
    dentistId: 5,
    patientName: "Ikay Gundogan",
    startTime: "12:00",
    endTime: "13:55",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date().toISOString().slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 8,
    dentistId: 1,
    patientName: "Mavins Bernado",
    startTime: "08:00",
    endTime: "10:15",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 9,
    dentistId: 2,
    patientName: "Sarah Johnson",
    startTime: "09:00",
    endTime: "10:00",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 10,
    dentistId: 1,
    patientName: "Mike Wilson",
    startTime: "14:00",
    endTime: "15:30",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 11,
    dentistId: 3,
    patientName: "Emma Davis",
    startTime: "11:00",
    endTime: "12:00",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 12,
    dentistId: 1,
    patientName: "Ikay Gundogan",
    startTime: "12:00",
    endTime: "14:00",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date(new Date().setDate(new Date().getDate() + 2))
      .toISOString()
      .slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 13,
    dentistId: 4,
    patientName: "Ikay Gundogan",
    startTime: "12:00",
    endTime: "13:55",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date(new Date().setDate(new Date().getDate() - 2))
      .toISOString()
      .slice(0, 10),
    color: getRandomColor(),
  },
  {
    id: 14,
    dentistId: 5,
    patientName: "james rodriguez",
    startTime: "12:00",
    endTime: "13:55",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?",
    date: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .slice(0, 10),
    color: getRandomColor(),
  },
];
