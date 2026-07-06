// ============================================================
//  Python3エンジニア認定 データ分析試験  模擬問題集
//  ※本問題はすべてオリジナルの学習用問題です。
//    公式過去問・各社模擬試験の複製ではありません。
//    出題範囲:『Pythonによるあたらしいデータ分析の教科書 第2版』(翔泳社)
// ============================================================
//
//  データ形式:
//  { id, cat(章カテゴリ), q(問題文), choices[4], answer(正解index 0-3), exp(解説) }
//
//  カテゴリ(cat)一覧:
//   role   : データ分析エンジニアの役割
//   env    : 実行環境構築 / Jupyter
//   pybase : Pythonの基礎
//   math   : 数学の基礎(線形代数・微分積分・確率統計)
//   numpy  : NumPy
//   pandas : pandas
//   plot   : Matplotlib
//   ml     : 機械学習(scikit-learn)
//   data   : データ収集と加工
//
window.QUESTIONS = [
  // ---------- role : データ分析エンジニアの役割 ----------
  {
    id: 1, cat: "role",
    q: "データ分析のプロセスにおいて、一般に最も多くの時間を要するとされる工程はどれか。",
    choices: ["データの可視化", "データの取得・前処理(データクレンジング)", "機械学習モデルの学習", "分析結果のレポート作成"],
    answer: 1,
    exp: "実務のデータ分析では、欠損値や表記ゆれの処理などデータの取得・前処理に全工程の大半の時間が費やされるといわれる。"
  },
  {
    id: 2, cat: "role",
    q: "機械学習の学習方法の分類として、正しい組み合わせはどれか。",
    choices: ["教師あり学習・教師なし学習・強化学習", "回帰学習・分類学習・クラスタリング学習",
              "線形学習・非線形学習・深層学習", "バッチ学習・逐次学習・並列学習"],
    answer: 0,
    exp: "機械学習は大きく『教師あり学習』『教師なし学習』『強化学習』に分類される。回帰・分類は教師あり学習の中の課題。"
  },
  {
    id: 3, cat: "role",
    q: "教師あり学習に分類されるタスクとして正しいものはどれか。",
    choices: ["クラスタリング", "次元削減", "回帰", "アソシエーション分析"],
    answer: 2,
    exp: "回帰と分類は正解ラベル(教師データ)を用いる教師あり学習。クラスタリング・次元削減は教師なし学習。"
  },

  // ---------- env : 実行環境 / Jupyter ----------
  {
    id: 4, cat: "env",
    q: "科学技術計算向けにPython本体と主要ライブラリをまとめて提供するディストリビューションはどれか。",
    choices: ["Anaconda", "Homebrew", "Docker", "Node.js"],
    answer: 0,
    exp: "Anacondaはデータ分析向けにNumPy・pandas・Jupyterなどをまとめて含むディストリビューション。"
  },
  {
    id: 5, cat: "env",
    q: "Jupyter Notebook上で、コードセルを実行しつつ次のセルに移動するキー操作はどれか。",
    choices: ["Ctrl + Enter", "Shift + Enter", "Alt + Enter", "Tab + Enter"],
    answer: 1,
    exp: "Shift+Enterは実行して次セルへ移動。Ctrl+Enterは実行してその場に留まる。Alt+Enterは実行して下に新規セルを挿入。"
  },
  {
    id: 6, cat: "env",
    q: "pipコマンドで指定したパッケージを最新版にアップグレードするオプションはどれか。",
    choices: ["pip install --new numpy", "pip install --latest numpy", "pip install -U numpy", "pip update numpy"],
    answer: 2,
    exp: "`-U`(または`--upgrade`)で既存パッケージを最新版に更新する。`pip update`というサブコマンドは存在しない。"
  },

  // ---------- pybase : Pythonの基礎 ----------
  {
    id: 7, cat: "pybase",
    q: "次のコードの出力として正しいものはどれか。\n\nprint(type([1, 2, 3]))",
    choices: ["<class 'tuple'>", "<class 'list'>", "<class 'set'>", "<class 'array'>"],
    answer: 1,
    exp: "角括弧[]で作られるのはリスト(list)。丸括弧はtuple、波括弧はsetまたはdict。"
  },
  {
    id: 8, cat: "pybase",
    q: "リスト a = [0, 1, 2, 3, 4, 5] に対し a[1:4] の結果はどれか。",
    choices: ["[1, 2, 3]", "[1, 2, 3, 4]", "[0, 1, 2, 3]", "[2, 3, 4]"],
    answer: 0,
    exp: "スライス a[start:stop] は start を含み stop を含まない。よって index 1,2,3 の [1,2,3]。"
  },
  {
    id: 9, cat: "pybase",
    q: "内包表記 [x**2 for x in range(5) if x % 2 == 0] の結果はどれか。",
    choices: ["[0, 1, 4, 9, 16]", "[0, 4, 16]", "[0, 2, 4]", "[4, 16]"],
    answer: 1,
    exp: "range(5)=0,1,2,3,4のうち偶数0,2,4を2乗して[0,4,16]。"
  },
  {
    id: 10, cat: "pybase",
    q: "辞書 d = {'a': 1, 'b': 2} に対し、キーが存在しない場合にデフォルト値0を返す安全な取得方法はどれか。",
    choices: ["d['c']", "d.get('c', 0)", "d.default('c', 0)", "d.fetch('c', 0)"],
    answer: 1,
    exp: "get(key, default)は存在しないキーでも例外を出さずデフォルト値を返す。d['c']はKeyErrorになる。"
  },
  {
    id: 11, cat: "pybase",
    q: "関数定義で任意個のキーワード引数を受け取る仮引数の書き方はどれか。",
    choices: ["def f(*args):", "def f(**kwargs):", "def f(&kwargs):", "def f(...kwargs):"],
    answer: 1,
    exp: "`**kwargs`で任意個のキーワード引数を辞書として受け取る。`*args`は位置引数をタプルで受け取る。"
  },

  // ---------- math : 数学の基礎 ----------
  {
    id: 12, cat: "math",
    q: "データの散らばりを表す指標で、分散の正の平方根として定義されるものはどれか。",
    choices: ["中央値", "標準偏差", "最頻値", "四分位範囲"],
    answer: 1,
    exp: "標準偏差は分散の正の平方根。元データと同じ単位になるため散らばりの解釈がしやすい。"
  },
  {
    id: 13, cat: "math",
    q: "2つの変数の直線的な関係の強さを -1〜1 の範囲で表す指標はどれか。",
    choices: ["共分散", "相関係数", "標準偏差", "変動係数"],
    answer: 1,
    exp: "(ピアソンの)相関係数は-1〜1に正規化され、1に近いほど正の直線関係が強い。共分散は単位に依存し範囲が固定されない。"
  },
  {
    id: 14, cat: "math",
    q: "行列の積 A・B が計算可能となる条件として正しいものはどれか。",
    choices: ["Aの行数とBの列数が等しい", "Aの列数とBの行数が等しい", "AとBが同じ形状", "AとBが正方行列"],
    answer: 1,
    exp: "(m×n)行列と(n×p)行列の積が定義でき、結果は(m×p)。すなわちAの列数とBの行数が一致する必要がある。"
  },
  {
    id: 15, cat: "math",
    q: "関数 f(x) = x^2 の導関数 f'(x) はどれか。",
    choices: ["x", "2x", "x^3/3", "2"],
    answer: 1,
    exp: "べき乗の微分公式 d/dx(x^n)=n・x^(n-1) より f'(x)=2x。"
  },
  {
    id: 16, cat: "math",
    q: "確率において、サイコロを1回振って偶数の目が出る確率はどれか。",
    choices: ["1/6", "1/3", "1/2", "2/3"],
    answer: 2,
    exp: "偶数は2,4,6の3通り。全6通りなので 3/6 = 1/2。"
  },
  {
    id: 17, cat: "math",
    q: "正規分布に関する記述として正しいものはどれか。",
    choices: ["平均と中央値と最頻値が一致する左右対称の分布である", "必ず0以上の値しかとらない",
              "分散が大きいほど尖った形になる", "離散型の確率分布である"],
    answer: 0,
    exp: "正規分布は平均を中心に左右対称の連続分布で、平均・中央値・最頻値が一致する。分散が大きいほど裾が広く平たくなる。"
  },

  // ---------- numpy ----------
  {
    id: 18, cat: "numpy",
    q: "NumPyを慣例的にインポートする書き方はどれか。",
    choices: ["import numpy as nm", "import numpy as np", "import numpy as npy", "from numpy import *"],
    answer: 1,
    exp: "慣例として `import numpy as np` が用いられる。"
  },
  {
    id: 19, cat: "numpy",
    q: "0から始まり10未満の連続整数からなる1次元配列を生成する式はどれか。",
    choices: ["np.range(10)", "np.arange(10)", "np.linspace(10)", "np.array(10)"],
    answer: 1,
    exp: "np.arange(10)は0〜9の配列を生成。np.rangeは存在しない。np.linspaceは区間を等分割する(引数の意味が異なる)。"
  },
  {
    id: 20, cat: "numpy",
    q: "2次元配列 a の形状(行数・列数)を取得する属性はどれか。",
    choices: ["a.size", "a.shape", "a.ndim", "a.length"],
    answer: 1,
    exp: "shapeは各次元の要素数をタプルで返す。sizeは総要素数、ndimは次元数。"
  },
  {
    id: 21, cat: "numpy",
    q: "配列 a = np.array([1, 2, 3, 4]) に対し a * 2 の結果はどれか。",
    choices: ["array([1, 2, 3, 4, 1, 2, 3, 4])", "array([2, 4, 6, 8])", "エラーになる", "array([2, 2, 2, 2])"],
    answer: 1,
    exp: "NumPy配列のスカラー乗算は各要素に適用される(ブロードキャスト)。リストの`*2`とは異なり連結にはならない。"
  },
  {
    id: 22, cat: "numpy",
    q: "1次元配列を2行3列に形状変更するメソッドはどれか(要素数は6)。",
    choices: ["a.resize(2, 3)のみ可能", "a.reshape(2, 3)", "a.shape(2, 3)", "a.transpose(2, 3)"],
    answer: 1,
    exp: "reshape(2, 3)で形状を変更した新しいビューを返す。総要素数が一致している必要がある。"
  },
  {
    id: 23, cat: "numpy",
    q: "配列 a のすべての要素の平均を求める式はどれか。",
    choices: ["a.avg()", "a.mean()", "a.average", "np.median(a)"],
    answer: 1,
    exp: "mean()メソッド(またはnp.mean(a))で平均を計算する。np.medianは中央値。"
  },
  {
    id: 24, cat: "numpy",
    q: "np.zeros((2, 3)) が生成する配列として正しいものはどれか。",
    choices: ["要素がすべて1の2×3配列", "要素がすべて0の2×3配列", "要素がすべて0の3×2配列", "空の配列"],
    answer: 1,
    exp: "np.zeros(shape)は指定形状で全要素0の配列を生成。全1にはnp.ones、単位行列にはnp.eyeを使う。"
  },

  // ---------- pandas ----------
  {
    id: 25, cat: "pandas",
    q: "pandasの2次元の表形式データを扱う主要なデータ構造はどれか。",
    choices: ["Series", "DataFrame", "Panel", "Index"],
    answer: 1,
    exp: "DataFrameは行と列を持つ2次元データ構造。Seriesは1次元(ラベル付き配列)。"
  },
  {
    id: 26, cat: "pandas",
    q: "DataFrame df の先頭5行を表示するメソッドはどれか。",
    choices: ["df.top()", "df.head()", "df.first(5)", "df.begin()"],
    answer: 1,
    exp: "head()はデフォルトで先頭5行を返す。末尾はtail()。"
  },
  {
    id: 27, cat: "pandas",
    q: "DataFrame df の各数値列について件数・平均・標準偏差・四分位数などの要約統計量を一括表示するメソッドはどれか。",
    choices: ["df.info()", "df.describe()", "df.summary()", "df.stats()"],
    answer: 1,
    exp: "describe()はcount, mean, std, min, 25/50/75%, maxなどの要約統計量を返す。info()は列名・型・非欠損数を表示。"
  },
  {
    id: 28, cat: "pandas",
    q: "ラベル(行名・列名)を指定してDataFrameの要素を参照するインデクサはどれか。",
    choices: ["df.iloc[]", "df.loc[]", "df.at_label[]", "df.get[]"],
    answer: 1,
    exp: "locはラベルベース、ilocは位置(整数)ベースのインデクサ。"
  },
  {
    id: 29, cat: "pandas",
    q: "DataFrameの各列の欠損値の有無を真偽値で返すメソッドはどれか。",
    choices: ["df.isnull()", "df.isempty()", "df.hasnan()", "df.missing()"],
    answer: 0,
    exp: "isnull()(別名isna())で欠損値をTrue/Falseで返す。df.isnull().sum()で列ごとの欠損数を集計できる。"
  },
  {
    id: 30, cat: "pandas",
    q: "指定した列の値でグループ化し集計を行うメソッドはどれか。",
    choices: ["df.cluster()", "df.groupby()", "df.aggregate_by()", "df.partition()"],
    answer: 1,
    exp: "groupby('列')でグループ化し、mean()やsum()などの集計を続けて適用する。"
  },
  {
    id: 31, cat: "pandas",
    q: "欠損値を含む行を削除するメソッドはどれか。",
    choices: ["df.dropna()", "df.fillna()", "df.removena()", "df.delete()"],
    answer: 0,
    exp: "dropna()で欠損を含む行(または列)を削除。fillna()は欠損を指定値で補完する。"
  },
  {
    id: 32, cat: "pandas",
    q: "2つのDataFrameを共通のキー列で結合(SQLのJOIN相当)するメソッドはどれか。",
    choices: ["pd.concat()", "pd.merge()", "pd.join_key()", "pd.union()"],
    answer: 1,
    exp: "pd.merge(df1, df2, on='key')でキー結合を行う。concatは軸方向の単純連結。"
  },

  // ---------- plot : Matplotlib ----------
  {
    id: 33, cat: "plot",
    q: "Matplotlibのpyplotモジュールを慣例的にインポートする書き方はどれか。",
    choices: ["import matplotlib as plt", "import matplotlib.pyplot as plt",
              "from matplotlib import plot as plt", "import pyplot as plt"],
    answer: 1,
    exp: "慣例として `import matplotlib.pyplot as plt` を用いる。"
  },
  {
    id: 34, cat: "plot",
    q: "2変数の分布を点で表し、相関の傾向を見るのに適したグラフはどれか。",
    choices: ["棒グラフ(bar)", "散布図(scatter)", "円グラフ(pie)", "ヒストグラム(hist)"],
    answer: 1,
    exp: "散布図は2つの連続変数の関係(相関)を可視化するのに適する。ヒストグラムは1変数の分布。"
  },
  {
    id: 35, cat: "plot",
    q: "1つの連続変数の度数分布(データの分布)を表示するのに適したグラフを描く関数はどれか。",
    choices: ["plt.plot()", "plt.hist()", "plt.pie()", "plt.bar()"],
    answer: 1,
    exp: "plt.hist()はヒストグラムを描画し、データを区間(ビン)に分けて度数を表示する。"
  },

  // ---------- ml : 機械学習(scikit-learn) ----------
  {
    id: 36, cat: "ml",
    q: "scikit-learnで、学習データとテストデータに分割する関数はどれか。",
    choices: ["split_data()", "train_test_split()", "cross_split()", "data_partition()"],
    answer: 1,
    exp: "sklearn.model_selection.train_test_split()で学習用・テスト用にデータを分割する。"
  },
  {
    id: 37, cat: "ml",
    q: "scikit-learnの推定器(Estimator)でモデルを学習させる共通メソッドはどれか。",
    choices: ["model.train()", "model.fit()", "model.learn()", "model.build()"],
    answer: 1,
    exp: "fit(X, y)で学習、predict(X)で予測を行うのがscikit-learnの共通インターフェース。"
  },
  {
    id: 38, cat: "ml",
    q: "教師なし学習であり、データを類似したグループに分ける手法はどれか。",
    choices: ["線形回帰", "ロジスティック回帰", "k-means(クラスタリング)", "決定木分類"],
    answer: 2,
    exp: "k-meansは正解ラベルを使わずデータを k 個のクラスタに分ける教師なし学習の代表手法。"
  },
  {
    id: 39, cat: "ml",
    q: "分類モデルの評価指標で、『予測が正しかった割合』を表す最も基本的な指標はどれか。",
    choices: ["決定係数(R^2)", "正解率(Accuracy)", "平均二乗誤差(MSE)", "シルエット係数"],
    answer: 1,
    exp: "正解率は(正しく分類した数)/(全体数)。R^2やMSEは回帰、シルエット係数はクラスタリングの評価指標。"
  },
  {
    id: 40, cat: "ml",
    q: "学習データには高精度だが未知データで精度が低下する現象を何というか。",
    choices: ["アンダーフィッティング", "オーバーフィッティング(過学習)", "正規化", "次元削減"],
    answer: 1,
    exp: "過学習(オーバーフィッティング)は訓練データに適合しすぎて汎化性能が下がる状態。逆に単純すぎるのがアンダーフィッティング。"
  },
  {
    id: 41, cat: "ml",
    q: "連続値を予測する教師あり学習のタスクはどれか。",
    choices: ["分類", "回帰", "クラスタリング", "次元削減"],
    answer: 1,
    exp: "回帰は住宅価格や気温などの連続値を予測する。カテゴリを当てるのは分類。"
  },
  {
    id: 42, cat: "ml",
    q: "モデルの汎化性能をより信頼性高く評価するため、データを複数分割して評価を繰り返す手法はどれか。",
    choices: ["グリッドサーチ", "交差検証(クロスバリデーション)", "標準化", "アンサンブル学習"],
    answer: 1,
    exp: "交差検証はデータをk分割し、各分割をテストに使いながらk回評価して平均をとる。評価の偏りを減らせる。"
  },
  {
    id: 43, cat: "ml",
    q: "特徴量ごとにスケールが大きく異なる場合に、平均0・分散1へ変換する前処理はどれか。",
    choices: ["標準化(StandardScaler)", "one-hotエンコーディング", "主成分分析", "ラベルエンコーディング"],
    answer: 0,
    exp: "標準化は各特徴量を平均0・標準偏差1に変換する。スケール差の影響を受ける手法(k-means, SVM等)で有効。"
  },

  // ---------- data : データ収集と加工 ----------
  {
    id: 44, cat: "data",
    q: "カテゴリ変数を、各カテゴリを0/1の列に展開して数値化する手法はどれか。",
    choices: ["正規化", "one-hotエンコーディング", "標準化", "ビニング"],
    answer: 1,
    exp: "one-hotエンコーディングはカテゴリごとにダミー変数(0/1列)を作る。pandasではget_dummies()で実現できる。"
  },
  {
    id: 45, cat: "data",
    q: "CSVファイルをDataFrameとして読み込むpandasの関数はどれか。",
    choices: ["pd.load_csv()", "pd.read_csv()", "pd.open_csv()", "pd.import_csv()"],
    answer: 1,
    exp: "pd.read_csv('file.csv')でCSVを読み込む。書き出しはto_csv()。"
  }
];

// カテゴリ表示名
window.CATEGORIES = {
  role:   "データ分析エンジニアの役割",
  env:    "実行環境 / Jupyter",
  pybase: "Pythonの基礎",
  math:   "数学の基礎",
  numpy:  "NumPy",
  pandas: "pandas",
  plot:   "Matplotlib",
  ml:     "機械学習(scikit-learn)",
  data:   "データ収集と加工"
};
