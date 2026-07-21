import * as React from "react"
import { PowerIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CATEGORIES, LEVELS, QUESTIONS, type CategoryKey } from "@/data"
import { useProgress } from "@/hooks/use-progress"
import { BrowseView } from "@/features/browse-view"
import { HomeView, type HomeSettings } from "@/features/home-view"
import { QuizView } from "@/features/quiz-view"
import { ResultView } from "@/features/result-view"
import { isDesktop, shutdown } from "@/lib/progress"
import {
  DEFAULT_FILTERS,
  filterQuestions,
  newSession,
  shuffled,
  type Session,
} from "@/lib/quiz"

type View = "home" | "quiz" | "browse" | "result" | "closed"

const ALL_CATS = Object.keys(CATEGORIES) as CategoryKey[]

const INITIAL_SETTINGS: HomeSettings = {
  cats: ALL_CATS,
  levels: [...LEVELS],
  numQ: "40",
  shuffle: true,
  wrongOnly: false,
  filters: DEFAULT_FILTERS,
}

export function App() {
  const progress = useProgress()
  const { stats, flags, ready, recordAnswer, addFlag, undoFlag, resetAll, snapshot } =
    progress

  const [view, setView] = React.useState<View>("home")
  const [settings, setSettings] = React.useState<HomeSettings>(INITIAL_SETTINGS)
  const [session, setSession] = React.useState<Session | null>(null)
  const [selected, setSelected] = React.useState<number | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)
  const [exitOpen, setExitOpen] = React.useState(false)

  // 画面が切り替わったら先頭へ(旧 index.html の window.scrollTo(0,0) 相当)
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [view, session?.idx])

  const startQuiz = () => {
    const { cats, levels, wrongOnly, shuffle, numQ, filters } = settings
    if (cats.length === 0) return setNotice("分野を1つ以上選択してください。")
    if (levels.length === 0) return setNotice("難易度を1つ以上選択してください。")

    let pool = QUESTIONS.filter((q) => cats.includes(q.cat) && levels.includes(q.level))
    if (wrongOnly) {
      pool = pool.filter((q) => stats[q.id] && stats[q.id].seen > stats[q.id].correct)
      if (pool.length === 0) {
        return setNotice("誤答した問題がありません。まずは通常出題で解いてみましょう。")
      }
    }
    pool = filterQuestions(pool, cats, levels, filters, stats, flags)
    if (pool.length === 0) {
      return setNotice("絞り込み条件に一致する問題がありません。条件を変更してください。")
    }
    if (shuffle) pool = shuffled(pool)
    const num = parseInt(numQ, 10)
    if (num > 0 && pool.length > num) pool = pool.slice(0, num)

    setSession(newSession(pool))
    setSelected(null)
    setView("quiz")
  }

  const answer = (index: number) => {
    if (!session || selected !== null) return
    const q = session.list[session.idx]
    const right = index === q.answer
    setSelected(index)
    setSession({
      ...session,
      correct: session.correct + (right ? 1 : 0),
      answers: [...session.answers, { id: q.id, cat: q.cat, right, sel: index }],
    })
    recordAnswer(q.id, right)
  }

  const next = () => {
    if (!session) return
    const idx = session.idx + 1
    setSelected(null)
    if (idx >= session.list.length) setView("result")
    else setSession({ ...session, idx })
  }

  const retryWrong = () => {
    if (!session) return
    const wrongIds = session.answers.filter((a) => !a.right).map((a) => a.id)
    if (wrongIds.length === 0) return setNotice("誤答はありませんでした！")
    setSession(newSession(shuffled(QUESTIONS.filter((q) => wrongIds.includes(q.id)))))
    setSelected(null)
    setView("quiz")
  }

  const goHome = () => {
    setSession(null)
    setSelected(null)
    setView("home")
  }

  const exitApp = async () => {
    setExitOpen(false)
    const showFarewell = await shutdown(snapshot())
    if (showFarewell) setView("closed")
  }

  if (view === "closed") return <FarewellScreen />

  return (
    <div className="mx-auto max-w-3xl p-4">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">📊</span>
          <div>
            <h1 className="font-heading text-lg font-medium">
              データ分析試験 模擬問題集
            </h1>
            <p className="text-xs text-muted-foreground">
              Python3エンジニア認定 対策 ／ 学習用オリジナル問題
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExitOpen(true)}
          title="アプリを終了して閉じる"
        >
          <PowerIcon />
          終了
        </Button>
      </header>

      {!ready ? (
        <p className="text-sm text-muted-foreground">読み込み中…</p>
      ) : view === "home" ? (
        <HomeView
          settings={settings}
          onChange={setSettings}
          stats={stats}
          flags={flags}
          onStart={startQuiz}
          onBrowse={() => setView("browse")}
          onReset={resetAll}
        />
      ) : view === "browse" ? (
        <BrowseView
          onClose={goHome}
          flags={flags}
          onAddFlag={addFlag}
          onUndoFlag={undoFlag}
        />
      ) : view === "quiz" && session ? (
        <QuizView
          session={session}
          selected={selected}
          onAnswer={answer}
          onNext={next}
          onQuit={goHome}
          flags={flags}
          onAddFlag={addFlag}
          onUndoFlag={undoFlag}
        />
      ) : view === "result" && session ? (
        <ResultView session={session} onHome={goHome} onRetryWrong={retryWrong} />
      ) : null}

      <AlertDialog open={notice !== null} onOpenChange={() => setNotice(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>出題できません</AlertDialogTitle>
            <AlertDialogDescription>{notice}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setNotice(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={exitOpen} onOpenChange={setExitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>アプリを閉じますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {isDesktop()
                ? "成績は自動保存されます。"
                : "サーバを終了します。未保存の操作は保存されます。"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={exitApp}>
              終了する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/** ブラウザ運用でサーバを止めたあとに出す画面。 */
function FarewellScreen() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <Card>
        <CardContent className="text-center">
          <h1 className="font-heading text-xl font-medium">👋 お疲れさまでした</h1>
          <p className="mt-2 text-sm">
            サーバを終了しました。学習データは progress.json に保存されています。
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            このタブは閉じて構いません。自動で閉じない場合は手動で閉じてください。
          </p>
          <Button className="mt-4" onClick={() => window.close()}>
            タブを閉じる
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
