export default function Home() {
  return (
    <div className="p-5 pt-6 pb-24 md:pb-28">
      <h1 className="text-2xl md:text-3xl font-bold">Риболов България</h1>
      <p className="mt-2 text-white/80">
        Карта на езерата, профил, трофеи и турнири — всичко на едно място.
      </p>
      <ul className="mt-6 space-y-3">
        <li className="bg-ocean-800/60 border border-white/10 rounded-xl p-4">
          ➜ Влез с Google / Facebook / Apple и започни да събираш точки.
        </li>
        <li className="bg-ocean-800/60 border border-white/10 rounded-xl p-4">
          ➜ Качи снимка на улов, добави описание и вземи точки.
        </li>
        <li className="bg-ocean-800/60 border border-white/10 rounded-xl p-4">
          ➜ Виж предстоящи турнири и се състезавай приятелски.
        </li>
      </ul>
    </div>
  );
}