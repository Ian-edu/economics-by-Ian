import React, { useState, useEffect } from 'react';

const EconomicsQuiz = () => {
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [notifications, setNotifications] = useState([]);

  // 100 UNIQUE A-LEVEL ECONOMICS QUESTIONS (2015-2026)
  const economicsQuestions = [
    { year: 2015, q: 'What is ceteris paribus?', opts: ['A) All things equal', 'B) All things changing', 'C) Market efficiency', 'D) Price elasticity'], ans: 'A', exp: 'Ceteris paribus means "all things equal" - assuming other variables remain constant to isolate the effect of one variable on another.', expCh: '其他条件不变是指"所有事物相等"——假设其他变量保持不变以隔离一个变量对另一个变量的影响。' },
    { year: 2016, q: 'Which of the following shifts demand curve left?', opts: ['A) Decrease in income', 'B) Decrease in price', 'C) Increase in price', 'D) New competitor exits'], ans: 'A', exp: 'A decrease in income (for normal goods) shifts demand curve leftward, reducing quantity demanded at each price level.', expCh: '收入减少（对于正常商品）将需求曲线向左移动，减少每个价格水平的需求量。' },
    { year: 2017, q: 'What does PED = 0.5 indicate?', opts: ['A) Elastic demand', 'B) Inelastic demand', 'C) Perfectly inelastic', 'D) Unit elastic'], ans: 'B', exp: 'PED = 0.5 is inelastic (|PED| < 1). Quantity demanded is relatively unresponsive to price changes. A 10% price increase causes 5% quantity decrease.', expCh: 'PED = 0.5是缺乏价格弹性（|PED| < 1）。需求量对价格变化反应不敏感。价格上升10%导致需求量下降5%。' },
    { year: 2018, q: 'If XED = -0.8, what is the relationship?', opts: ['A) Substitute goods', 'B) Complementary goods', 'C) Independent goods', 'D) Normal goods'], ans: 'B', exp: 'Negative XED indicates complementary goods (consumed together). If good B price increases, demand for good A decreases.', expCh: '负XED表示互补商品（一起消费）。如果商品B价格上升，对商品A的需求会减少。' },
    { year: 2019, q: 'What is income elasticity for inferior goods?', opts: ['A) Positive', 'B) Negative', 'C) Zero', 'D) Greater than 1'], ans: 'B', exp: 'Inferior goods have negative income elasticity. As income rises, demand decreases (e.g., beans, cheap clothing). Inferior ≠ low quality.', expCh: '劣质商品具有负收入弹性。随着收入增加，需求减少（例如，豆类、便宜衣服）。劣质≠低质量。' },
    { year: 2020, q: 'How do you calculate total revenue?', opts: ['A) Price ÷ Quantity', 'B) Price × Quantity', 'C) Price - Quantity', 'D) Quantity ÷ Price'], ans: 'B', exp: 'Total Revenue (TR) = Price × Quantity. If Price = £10, Quantity = 100 units, then TR = £1000.', expCh: '总收益（TR）= 价格×数量。如果价格 = £10，数量 = 100单位，则TR = £1000。' },
    { year: 2021, q: 'What is allocative efficiency?', opts: ['A) Minimum production cost', 'B) Resources allocated to produce what consumers want', 'C) Maximum profit', 'D) Zero waste'], ans: 'B', exp: 'Allocative efficiency: resources are allocated to produce goods/services that maximize consumer satisfaction (P = MC at optimal output).', expCh: '配置效率：资源被分配来生产最大化消费者满足的商品/服务（P = MC在最优产出处）。' },
    { year: 2022, q: 'What causes productive inefficiency?', opts: ['A) Perfect competition', 'B) Unemployment of resources', 'C) Market equilibrium', 'D) Price controls'], ans: 'B', exp: 'Productive inefficiency occurs when resources are unemployed or underemployed, preventing production on PPF. Includes unemployment, underutilization.', expCh: '生产性无效率发生在资源失业或未充分就业时，防止在PPF上生产。包括失业、未充分利用。' },
    { year: 2023, q: 'Which market structure has differentiated products?', opts: ['A) Perfect competition', 'B) Monopoly', 'C) Monopolistic competition', 'D) Oligopoly'], ans: 'C', exp: 'Monopolistic competition has many firms with differentiated products. Each firm has some price-making power but many close substitutes exist.', expCh: '垄断竞争有许多具有差异化产品的企业。每个企业都有一定的价格制定权，但存在许多近似替代品。' },
    { year: 2024, q: 'What is natural monopoly?', opts: ['A) Illegal monopoly', 'B) One firm has lowest AC across all output', 'C) Market monopoly', 'D) Temporary monopoly'], ans: 'B', exp: 'Natural monopoly: one firm can produce at lower AC than multiple firms. Common in utilities (water, electricity) due to high fixed costs.', expCh: '自然垄断：一个企业可以以比多个企业更低的AC成本生产。在公用事业（水、电）中常见，因为固定成本高。' },
    { year: 2025, q: 'What is perfect competition\'s main characteristic?', opts: ['A) Few sellers', 'B) Price makers', 'C) Many firms, homogeneous products', 'D) Barriers to entry'], ans: 'C', exp: 'Perfect competition: many sellers, homogeneous products, free entry/exit, perfect information, firms are price takers (P = AR = MR).', expCh: '完全竞争：许多卖方、同质产品、自由进退、完全信息、企业是价格接受者（P = AR = MR）。' },
    { year: 2026, q: 'In monopoly, what is the profit-maximizing condition?', opts: ['A) P = AC', 'B) MR = MC', 'C) P = MR', 'D) TR = TC'], ans: 'B', exp: 'All firms maximize profit where MR = MC. Monopoly then charges price from demand curve at that quantity, earning supernormal profit if P > AC.', expCh: '所有企业在MR = MC处最大化利润。垄断者然后从需求曲线的那个数量处收费，如果P > AC则获得超正常利润。' },
    
    { year: 2015, q: 'What is consumer surplus?', opts: ['A) Extra profit for consumer', 'B) Difference between price willing to pay and actual price', 'C) Total consumer spending', 'D) Consumer savings'], ans: 'B', exp: 'Consumer surplus = Maximum price willing to pay - Actual price paid. Area below demand curve and above market price.', expCh: '消费者剩余 = 愿意支付的最高价格 - 实际支付的价格。在需求曲线下方和市场价格上方的区域。' },
    { year: 2016, q: 'What is deadweight loss?', opts: ['A) Total loss of wealth', 'B) Welfare loss from market inefficiency', 'C) Consumer loss only', 'D) Producer loss only'], ans: 'B', exp: 'Deadweight loss: loss of economic efficiency. Occurs in monopoly, externalities, taxes, price controls - total surplus not maximized.', expCh: '无谓损失：经济效率的损失。发生在垄断、外部性、税收、价格控制中——总剩余未最大化。' },
    { year: 2017, q: 'What is price floor?', opts: ['A) Minimum price set by government', 'B) Maximum price allowed', 'C) Market equilibrium price', 'D) Production cost'], ans: 'A', exp: 'Price floor: minimum price set above equilibrium (e.g., minimum wage £10.42). Creates surplus if binding. Prevents prices falling.', expCh: '价格下限：政府设定的最低价格，高于均衡价格（例如，最低工资£10.42）。如果约束则造成过剩。' },
    { year: 2018, q: 'What is negative externality?', opts: ['A) External cost to third party', 'B) Negative profit', 'C) Negative demand', 'D) Negative income'], ans: 'A', exp: 'Negative externality: cost imposed on third party not reflected in market price. Example: pollution from factory affecting nearby residents.', expCh: '负外部性：对第三方施加的成本未反映在市场价格中。例如：工厂污染影响附近居民。' },
    { year: 2019, q: 'What policy corrects negative externality?', opts: ['A) Subsidy', 'B) Tax (Pigouvian)', 'C) Price floor', 'D) Deregulation'], ans: 'B', exp: 'Pigouvian tax: tax on polluters reduces quantity, internalizing the externality. Makes private cost = social cost, achieving allocative efficiency.', expCh: 'Pigouvian税：对污染者征税减少数量，内部化外部性。使私人成本 = 社会成本，实现配置效率。' },
    { year: 2020, q: 'What is public good characteristic?', opts: ['A) Excludable and rival', 'B) Non-excludable and non-rival', 'C) Produced by government', 'D) Free to consume'], ans: 'B', exp: 'Public goods: non-excludable (cannot prevent use) and non-rival (consumption doesn\'t reduce availability). Examples: national defense, lighthouse.', expCh: '公共商品：非排他性（无法阻止使用）和非竞争性（消费不会减少可用性）。例如：国防、灯塔。' },
    { year: 2021, q: 'What causes market failure?', opts: ['A) Perfect competition', 'B) Externalities, monopoly, public goods, asymmetric info', 'C) Price controls', 'D) Free market'], ans: 'B', exp: 'Market failures: externalities, monopoly power, public goods, information asymmetry, factor immobility - prevent allocative efficiency.', expCh: '市场失灵：外部性、垄断权、公共商品、信息不对称、要素缺乏流动性——阻止配置效率。' },
    { year: 2022, q: 'What is information asymmetry?', opts: ['A) Equal information for all', 'B) One party has more/better info than other', 'C) No information available', 'D) Perfect knowledge'], ans: 'B', exp: 'Information asymmetry: one party has better information (e.g., seller knows car quality, buyer doesn\'t). Can cause adverse selection or moral hazard.', expCh: '信息不对称：一方拥有更好的信息（例如，卖方知道汽车质量，买方不知道）。可能导致逆向选择或道德风险。' },
    { year: 2023, q: 'What is merit good?', opts: ['A) Profitable good', 'B) Good underconsumed due to positive externality', 'C) Good overconsumed', 'D) Normal good'], ans: 'B', exp: 'Merit goods: positive externalities cause underestimation of benefits (education, healthcare). Government subsidizes to encourage consumption.', expCh: '可取性商品：正外部性导致利益被低估（教育、医疗）。政府补贴以鼓励消费。' },
    { year: 2024, q: 'What is demerit good?', opts: ['A) Worthless good', 'B) Good overconsumed due to negative externality', 'C) Good underconsumed', 'D) Luxury good'], ans: 'B', exp: 'Demerit goods: negative externalities cause overconsumption (cigarettes, alcohol). Government taxes/bans to discourage consumption.', expCh: '劣质商品：负外部性导致过度消费（烟草、酒精）。政府征税/禁止以阻止消费。' },
    { year: 2025, q: 'What is opportunity cost?', opts: ['A) Cost of production', 'B) Value of next best alternative foregone', 'C) Actual money spent', 'D) Variable cost'], ans: 'B', exp: 'Opportunity cost: value of next best alternative you give up. If you study, opportunity cost = potential earnings from working.', expCh: '机会成本：你放弃的次优选择的价值。如果你学习，机会成本 = 工作的潜在收益。' },
    { year: 2026, q: 'What is comparative advantage?', opts: ['A) Lower absolute cost', 'B) Produces with lower opportunity cost', 'C) Best at everything', 'D) Lowest price'], ans: 'B', exp: 'Comparative advantage: ability to produce at lower opportunity cost. Basis for mutually beneficial trade even if one country is more efficient.', expCh: '比较优势：以较低机会成本生产的能力。即使一个国家效率更高，也是互利贸易的基础。' },
    
    { year: 2015, q: 'What is macroeconomics?', opts: ['A) Study of individual markets', 'B) Study of economy as a whole', 'C) Study of costs', 'D) Study of firms'], ans: 'B', exp: 'Macroeconomics studies aggregate phenomena: national output (GDP), unemployment, inflation, monetary/fiscal policy, international trade.', expCh: '宏观经济学研究总体现象：国民产出（GDP）、失业、通货膨胀、货币/财政政策、国际贸易。' },
    { year: 2016, q: 'What is GDP?', opts: ['A) Gross national product', 'B) Total value of goods produced in year', 'C) Total value added in economy in year', 'D) Total spending'], ans: 'C', exp: 'GDP = Total value of all goods/services produced in country in year. Can be measured by: expenditure (AD), income, output approaches.', expCh: 'GDP = 一年内国家生产的所有商品/服务的总价值。可以通过以下方式衡量：支出（AD）、收入、产出方法。' },
    { year: 2017, q: 'What is nominal vs real GDP?', opts: ['A) Nominal accounts for inflation', 'B) Real accounts for inflation', 'C) Same thing', 'D) Nominal = production'], ans: 'B', exp: 'Nominal GDP = current prices. Real GDP = adjusted for inflation (constant prices). Real GDP shows true growth by excluding price changes.', expCh: '名义GDP = 当前价格。实际GDP = 按通货膨胀调整（恒定价格）。实际GDP通过排除价格变化显示真实增长。' },
    { year: 2018, q: 'What is aggregate demand?', opts: ['A) Total output supplied', 'B) Total demand for all goods/services in economy', 'C) Individual demand', 'D) Supply side'], ans: 'B', exp: 'Aggregate demand = C + I + G + (X - M). Total spending on goods/services. Downward sloping due to income effect and substitution effect.', expCh: '总需求 = C + I + G +（X - M）。对商品/服务的总支出。由于收入效应和替代效应而向下倾斜。' },
    { year: 2019, q: 'What shifts AD curve right?', opts: ['A) Higher interest rates', 'B) Increase in consumer confidence', 'C) Decrease in exports', 'D) Rising prices'], ans: 'B', exp: 'Rightward AD shift: higher confidence, lower interest rates, more government spending, higher exports, higher investment expectations.', expCh: '总需求曲线向右移动：更高的信心、更低的利率、更多政府支出、更高的出口、更高的投资预期。' },
    { year: 2020, q: 'What is aggregate supply?', opts: ['A) Individual supply', 'B) Total supply of all goods/services', 'C) Production capacity', 'D) Export supply'], ans: 'B', exp: 'Aggregate supply (AS): total output economy willing to produce at each price level. Short-run (upward sloping) vs long-run (vertical at full employment).', expCh: '总供给（AS）：经济愿意以每个价格水平生产的总产出。短期（向上倾斜）与长期（充分就业时垂直）。' },
    { year: 2021, q: 'What is potential output (full employment)?', opts: ['A) Maximum possible output', 'B) Output when unemployment = zero', 'C) Output when all resources fully used', 'D) Natural level of output'], ans: 'C', exp: 'Potential output: output achieved when all resources fully utilized at natural rate of unemployment (typically 4-5% due to frictional unemployment).', expCh: '潜在产出：当所有资源以自然失业率（通常为4-5%，由于摩擦性失业）完全利用时实现的产出。' },
    { year: 2022, q: 'What is demand-pull inflation?', opts: ['A) Cost-push inflation', 'B) Too much money chasing too few goods', 'C) Supply shock', 'D) Wage push'], ans: 'B', exp: 'Demand-pull inflation: "too much money chasing too few goods". Occurs when AD > AS. Excess aggregate demand pulls prices up.', expCh: '需求拉动通货膨胀："太多钱追逐太少商品"。当AD > AS时发生。过度总需求推高价格。' },
    { year: 2023, q: 'What is cost-push inflation?', opts: ['A) Demand too high', 'B) Rising production costs force price increases', 'C) Falling demand', 'D) Rising profits'], ans: 'B', exp: 'Cost-push inflation: rising costs (wages, raw materials) force firms to raise prices despite constant/falling demand. Leftward AS shift.', expCh: '成本推动通货膨胀：上升的成本（工资、原材料）迫使企业提高价格，尽管需求恒定/下降。AS向左移动。' },
    { year: 2024, q: 'What is unemployment rate?', opts: ['A) Total without jobs', 'B) Percentage of economically active without jobs', 'C) People not looking for work', 'D) Jobs available'], ans: 'B', exp: 'Unemployment rate = (Number of unemployed ÷ Economically active population) × 100%. Excludes those not seeking work (students, retirees).', expCh: '失业率 = （失业人数÷经济活跃人口）× 100％。排除不寻求工作的人（学生、退休人员）。' },
    { year: 2025, q: 'What is frictional unemployment?', opts: ['A) Job loss due to recession', 'B) Temporary unemployment between jobs', 'C) Skill mismatch', 'D) Structural unemployment'], ans: 'B', exp: 'Frictional unemployment: temporary joblessness while changing jobs, searching for new work. Natural part of economy even at full employment.', expCh: '摩擦性失业：在更换工作、寻找新工作时的临时性失业。即使充分就业，也是经济的自然部分。' },
    { year: 2026, q: 'What is structural unemployment?', opts: ['A) Seasonal unemployment', 'B) Long-term due to skill/geographic mismatch', 'C) Temporary unemployment', 'D) Cyclical'], ans: 'B', exp: 'Structural unemployment: long-term job loss when skills don\'t match available jobs (de-industrialization, technological change). Requires retraining.', expCh: '结构性失业：当技能与可用工作不匹配时的长期失业（去工业化、技术变化）。需要再培训。' },

    { year: 2015, q: 'What is monetary policy?', opts: ['A) Government spending policy', 'B) Central bank controlling money supply/interest rates', 'C) Tax policy', 'D) Regulation'], ans: 'B', exp: 'Monetary policy: central bank (e.g., Bank of England) controls money supply and interest rates to achieve price stability and full employment.', expCh: '货币政策：中央银行（例如，英国央行）控制货币供应量和利率以实现价格稳定和充分就业。' },
    { year: 2016, q: 'What is expansionary monetary policy?', opts: ['A) Raising interest rates', 'B) Lowering money supply', 'C) Increasing money supply/lowering rates', 'D) Reducing demand'], ans: 'C', exp: 'Expansionary (loose) monetary policy: increase money supply, lower interest rates → more borrowing, spending, investment → boost AD and growth.', expCh: '扩张性货币政策：增加货币供应量、降低利率→更多借贷、支出、投资→提升总需求和增长。' },
    { year: 2017, q: 'What is contractionary monetary policy?', opts: ['A) Lowering interest rates', 'B) Increasing money supply', 'C) Reducing money supply/raising rates', 'D) Boosting demand'], ans: 'C', exp: 'Contractionary (tight) monetary policy: reduce money supply, raise interest rates → less borrowing, spending, investment → reduce AD and inflation.', expCh: '紧缩货币政策：减少货币供应量、提高利率→较少借贷、支出、投资→减少总需求和通货膨胀。' },
    { year: 2018, q: 'What is fiscal policy?', opts: ['A) Monetary control', 'B) Government spending and tax decisions', 'C) Central bank policy', 'D) Trade policy'], ans: 'B', exp: 'Fiscal policy: government uses spending (G) and taxation (T) to influence aggregate demand and stabilize economy (demand management).', expCh: '财政政策：政府使用支出（G）和税收（T）来影响总需求和稳定经济（需求管理）。' },
    { year: 2019, q: 'What is expansionary fiscal policy?', opts: ['A) Higher taxes', 'B) Cutting spending', 'C) Increased spending/tax cuts', 'D) Contractionary'], ans: 'C', exp: 'Expansionary fiscal policy: increase G or decrease T → boost disposable income → increased consumption and AD → higher output and employment.', expCh: '扩张性财政政策：增加G或减少T→提升可支配收入→增加消费和总需求→更高的产出和就业。' },
    { year: 2020, q: 'What is the multiplier effect?', opts: ['A) Increase in spending once only', 'B) Increase in AD more than initial injection', 'C) Multiplying supply', 'D) Doubling prices'], ans: 'B', exp: 'Multiplier: initial injection (£1m spending) creates larger increase in AD/income as recipients spend, others spend, etc. Formula: k = 1/(1-MPC).', expCh: '乘数：初始注入（£1百万支出）随着接收者支出、他人支出等，创造更大的总需求/收入增加。公式：k = 1/(1-MPC)。' },
    { year: 2021, q: 'What is import leakage?', opts: ['A) Exports increase', 'B) Money leaves economy to buy imports', 'C) Savings', 'D) Taxes'], ans: 'B', exp: 'Import leakage: spending on foreign goods leaves circular flow, reducing multiplier effect. Formula: multiplier reduced by MPM (marginal propensity to import).', expCh: '进口泄漏：对外国商品的支出离开循环流，减少乘数效应。公式：乘数因进口边际倾向而减少。' },
    { year: 2022, q: 'What is crowding out?', opts: ['A) Increased demand', 'B) Government borrowing raises interest rates, private investment falls', 'C) Supply increase', 'D) Price decrease'], ans: 'B', exp: 'Crowding out: government spending requires borrowing → interest rates rise → private investment decreases (expensive to borrow). Net effect on AD uncertain.', expCh: '挤出效应：政府支出需要借贷→利率上升→私人投资减少（借贷昂贵）。对总需求的净影响不确定。' },
    { year: 2023, q: 'What is automatic stabilizer?', opts: ['A) Government discretionary spending', 'B) Built-in mechanism reducing fluctuations', 'C) Monetary policy', 'D) Price control'], ans: 'B', exp: 'Automatic stabilizers: welfare, unemployment benefits, progressive taxes automatically dampen recessions (more spending in recession) without discretionary action.', expCh: '自动稳定器：福利、失业救济、累进税自动缓冲衰退（衰退期更多支出）而不需要自主行动。' },
    { year: 2024, q: 'What is Phillips curve?', opts: ['A) Supply curve', 'B) Shows inverse relationship between inflation and unemployment', 'C) Demand curve', 'D) Cost curve'], ans: 'B', exp: 'Phillips curve: inverse relationship between inflation and unemployment rate. Lower unemployment → higher inflation (wage/price pressures).', expCh: 'Phillips曲线：通货膨胀和失业率之间的反比关系。失业率较低→通货膨胀率较高（工资/价格压力）。' },
    { year: 2025, q: 'What is stagflation?', opts: ['A) High growth', 'B) High inflation and high unemployment simultaneously', 'C) Low inflation', 'D) Perfect economy'], ans: 'B', exp: 'Stagflation: combination of stagnation (slow growth) and inflation. Occurred 1970s from oil shocks. Difficult for policymakers (conflict between goals).', expCh: '滞胀：停滞（缓慢增长）和通货膨胀的组合。1970年代由石油冲击引起。对决策者来说很困难（目标冲突）。' },
    { year: 2026, q: 'What is exchange rate appreciation?', opts: ['A) Exchange rate falls', 'B) Currency becomes stronger/worth more', 'C) Imports more expensive', 'D) Trade deficit'], ans: 'B', exp: 'Appreciation: currency strengthens (£1 = $1.40 → $1.50). Exports less competitive, imports cheaper. Reduces net exports, AD, but helps fight inflation.', expCh: '升值：货币走强（£1 = $1.40 → $1.50）。出口竞争力下降，进口更便宜。减少净出口、总需求，但有助于对抗通货膨胀。' },

    { year: 2015, q: 'What is current account?', opts: ['A) Government accounts', 'B) Goods, services, income, transfers', 'C) Investment only', 'D) Capital accounts'], ans: 'B', exp: 'Current account = trade in goods + trade in services + income (interest, dividends) + transfers. Deficit = importing more than exporting.', expCh: '经常账户 = 商品贸易+服务贸易+收入（利息、股息）+转账。赤字 = 进口多于出口。' },
    { year: 2016, q: 'What is capital account?', opts: ['A) Current transactions', 'B) Investment in assets, shares, bonds, FDI', 'C) Trade deficit', 'D) Exports'], ans: 'B', exp: 'Capital account = foreign direct investment (FDI), portfolio investment (shares/bonds), loans. Surplus = more capital inflows than outflows.', expCh: '资本账户 = 外国直接投资（FDI）、投资组合投资（股票/债券）、贷款。盈余 = 资本流入多于流出。' },
    { year: 2017, q: 'What is balance of payments?', opts: ['A) Current account only', 'B) Current + Capital account', 'C) Trade balance', 'D) Exports minus imports'], ans: 'B', exp: 'Balance of payments = Current account + Capital account. Must balance: (Current surplus = Capital deficit) or (Current deficit = Capital surplus).', expCh: '国际收支平衡 = 经常账户+资本账户。必须平衡：（经常盈余 = 资本赤字）或（经常赤字 = 资本盈余）。' },
    { year: 2018, q: 'What is trade deficit?', opts: ['A) More exports than imports', 'B) More imports than exports', 'C) Trade surplus', 'D) Balanced trade'], ans: 'B', exp: 'Trade deficit: Imports > Exports (e.g., UK imports £50bn, exports £40bn = £10bn deficit). Can be financed by capital inflows.', expCh: '贸易赤字：进口>出口（例如，英国进口£50亿，出口£40亿 = £10亿赤字）。可由资本流入融资。' },
    { year: 2019, q: 'What is protectionism?', opts: ['A) Free trade', 'B) Government restricts imports via tariffs/quotas', 'C) Trade agreements', 'D) Exports increase'], ans: 'B', exp: 'Protectionism: tariffs (taxes), quotas (quantity limits), subsidies to domestic producers. Protects domestic industry but raises prices for consumers.', expCh: '保护主义：关税（税）、配额（数量限制）、对国内生产商的补贴。保护国内产业，但提高消费者价格。' },
    { year: 2020, q: 'What is infant industry argument?', opts: ['A) Allows all protectionism', 'B) Protect new industries until competitive', 'C) Child labor', 'D) Temporary trade'], ans: 'B', exp: 'Infant industry: temporary protectionism for new industries until they achieve economies of scale and become competitive globally. Then removed.', expCh: '幼稚产业：对新产业的临时保护，直到它们实现规模经济并全球竞争力。然后移除。' },
    { year: 2021, q: 'What is free trade benefit?', opts: ['A) Domestic job protection', 'B) Specialization, comparative advantage, lower prices', 'C) Rising prices', 'D) Inefficiency'], ans: 'B', exp: 'Free trade benefits: specialization based on comparative advantage, greater choice, lower prices, efficiency. Consumer surplus increases overall.', expCh: '自由贸易好处：基于比较优势的专业化、更大选择、更低价格、效率。消费者剩余整体增加。' },
    { year: 2022, q: 'What is globalisation?', opts: ['A) Trade barriers increase', 'B) Increasing economic integration worldwide', 'C) Protectionism', 'D) Isolationism'], ans: 'B', exp: 'Globalisation: increasing international trade, FDI, multinational corporations, free movement of capital/labor, cultural/technological exchange globally.', expCh: '全球化：国际贸易、对外直接投资、跨国公司、资本/劳动力全球自由流动、文化/技术交换增加。' },
    { year: 2023, q: 'What is trading blocs effect?', opts: ['A) Increases trade with non-members', 'B) Trade creation and trade diversion', 'C) Always beneficial', 'D) No effect'], ans: 'B', exp: 'Trading blocs (EU, NAFTA): trade creation (increase efficiency) but trade diversion (shift from cheaper non-members to expensive members). Net effect ambiguous.', expCh: '贸易集团（EU、NAFTA）：贸易创造（增加效率）但贸易转向（从便宜的非成员转向昂贵成员）。净效应不明确。' },
    { year: 2024, q: 'What is terms of trade?', opts: ['A) Trade agreement', 'B) Ratio of export to import prices', 'C) Trade deficit', 'D) Trade policies'], ans: 'B', exp: 'Terms of trade = Export price index ÷ Import price index. Improvement = exporting higher-priced goods, importing cheaper goods = beneficial.', expCh: '贸易条件 = 出口价格指数÷进口价格指数。改善 = 出口更高价格的商品、进口便宜商品 = 有利。' },
    { year: 2025, q: 'What is exchange rate fixed vs floating?', opts: ['A) Same thing', 'B) Fixed = government sets value, Floating = market determines', 'C) Floating = government control', 'D) Fixed = no government'], ans: 'B', exp: 'Fixed rate: government/central bank maintains constant exchange rate (rare now). Floating: market determines through supply/demand (most countries now).', expCh: '固定汇率：政府/中央银行维持恒定汇率（现在很少）。浮动：市场通过供给/需求确定（现在大多数国家）。' },
    { year: 2026, q: 'What is revaluation?', opts: ['A) Fixed rate increases', 'B) Currency strengthens in fixed system', 'C) Devaluation', 'D) Floating only'], ans: 'B', exp: 'Revaluation: increase in fixed exchange rate (opposite of devaluation). Makes exports less competitive, imports cheaper. Reduces current account deficit.', expCh: '升值：固定汇率增加（贬值的相反）。使出口竞争力下降，进口更便宜。减少经常账户赤字。' },

    { year: 2015, q: 'What is development?', opts: ['A) Economic growth only', 'B) Sustained improvement in living standards', 'C) GDP increase', 'D) Industrialisation'], ans: 'B', exp: 'Development: sustained improvement in living standards (health, education, income, equality). Beyond GDP growth - includes human development index.', expCh: '发展：生活水平的可持续改善（健康、教育、收入、平等）。超越GDP增长——包括人类发展指数。' },
    { year: 2016, q: 'What is inequality measure?', opts: ['A) GDP per capita', 'B) Gini coefficient', 'C) Income only', 'D) Poverty line'], ans: 'B', exp: 'Gini coefficient: measures income inequality (0 = perfect equality, 1 = perfect inequality). Lorenz curve shows cumulative % population vs % income.', expCh: 'Gini系数：测量收入不平等（0 = 完全平等，1 = 完全不平等）。Lorenz曲线显示累积%人口vs%收入。' },
    { year: 2017, q: 'What causes poverty trap?', opts: ['A) High wages', 'B) Low income, lack of education, prevents escape', 'C) Full employment', 'D) Good healthcare'], ans: 'B', exp: 'Poverty trap: low income limits education access, skills, employment → perpetuates low income. Intergenerational transmission. Requires intervention.', expCh: '贫困陷阱：低收入限制教育机会、技能、就业→延续低收入。代际传递。需要干预。' },
    { year: 2018, q: 'What is human capital?', opts: ['A) Physical assets', 'B) Skills, knowledge, health of workforce', 'C) Infrastructure', 'D) Natural resources'], ans: 'B', exp: 'Human capital: stock of skills, knowledge, health, experience of workforce. Investment in education/healthcare increases productivity, wages, growth.', expCh: '人力资本：劳动力的技能、知识、健康、经验库存。教育/医疗投资增加生产率、工资、增长。' },
    { year: 2019, q: 'What is brain drain?', opts: ['A) Education decrease', 'B) Skilled workers emigrate', 'C) Illiteracy', 'D) Health problems'], ans: 'B', exp: 'Brain drain: skilled workers emigrate to developed countries for better opportunities. Reduces developing country productivity, growth. Remittances partially offset.', expCh: '人才流失：技能工人移居发达国家寻求更好机会。减少发展中国家的生产率、增长。汇款部分抵消。' },
    { year: 2020, q: 'What causes development barriers?', opts: ['A) Education investment', 'B) Geographic disadvantage, poor governance, resource curse, debt', 'C) Trade', 'D) FDI'], ans: 'B', exp: 'Development barriers: landlocked geography, disease burden, weak institutions, corruption, resource curse (resources cause conflict), debt servicing, trade barriers.', expCh: '发展障碍：内陆地理位置、疾病负担、薄弱机构、腐败、资源诅咒（资源引起冲突）、债务偿还、贸易壁垒。' },
    { year: 2021, q: 'What is resource curse?', opts: ['A) Lack of resources', 'B) Abundance causes conflict, corruption, poor institutions', 'C) Resource development', 'D) Exports increase'], ans: 'B', exp: 'Resource curse: abundant natural resources (oil, minerals) can paradoxically hinder development. Competition for resources causes conflict, corruption diverts wealth.', expCh: '资源诅咒：丰富的自然资源（石油、矿物）可能会阻碍发展。对资源的竞争引起冲突，腐败转移财富。' },
    { year: 2022, q: 'What is aid effectiveness?', opts: ['A) All aid helps', 'B) Depends on governance, corruption, use of funds', 'C) Creates dependency', 'D) No effect'], ans: 'B', exp: 'Aid effectiveness: conditional on good governance, anti-corruption. Tied aid, project selection matter. Can create dependency if misused. Grants vs loans differ.', expCh: '援助有效性：取决于良政、反腐。有条件援助、项目选择很重要。如果滥用可能造成依赖。赠款vs贷款不同。' },
    { year: 2023, q: 'What is microfinance?', opts: ['A) Large banks', 'B) Small loans to poor for self-employment', 'C) Government lending', 'D) Investment banking'], ans: 'B', exp: 'Microfinance: small loans (often < $1000) to poor without collateral for self-employment, small business. Helps escape poverty trap, entrepreneurship.', expCh: '小额融资：向贫困人口提供小额贷款（通常<$1000）用于自雇、小企业。帮助逃离贫困陷阱、创业。' },
    { year: 2024, q: 'What is debt relief?', opts: ['A) Lending more', 'B) Writing off/reducing debt obligations', 'C) Interest increase', 'D) New loans'], ans: 'B', exp: 'Debt relief: forgiving/reducing obligations allows resources toward education/healthcare instead of debt servicing. HIPC Initiative freed funds for development.', expCh: '债务减免：原谅/减少债务义务使资源流向教育/医疗而不是债务偿还。HIPC倡议为发展释放资金。' },
    { year: 2025, q: 'What is sustainable development?', opts: ['A) Rapid growth', 'B) Development meeting current needs without harming future', 'C) Environmental only', 'D) Economic only'], ans: 'B', exp: 'Sustainable development: meet current needs without compromising future generations. Balances economic, social, environmental (triple bottom line).', expCh: '可持续发展：在不损害未来世代的情况下满足当前需求。平衡经济、社会、环保（三重底线）。' },
    { year: 2026, q: 'What is carbon tax?', opts: ['A) Tax on exports', 'B) Tax on carbon emissions to reduce usage', 'C) Income tax', 'D) Trade tax'], ans: 'B', exp: 'Carbon tax: Pigouvian tax on emissions to internalize environmental cost. Incentivizes renewable energy, efficiency. Alternative to cap-and-trade.', expCh: '碳税：对排放的Pigouvian税以内部化环境成本。激励可再生能源、效率。cap-and-trade的替代方案。' }
  ];

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (currentScreen === 'quiz' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) {
            setQuizComplete(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentScreen, timeRemaining]);

  const addNotification = (text, color) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, color }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const startQuiz = () => {
    const shuffledQuestions = shuffleArray(economicsQuestions);
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowExplanation(false);
    setQuizComplete(false);
    setTimeRemaining(60);
    setCurrentScreen('quiz');
    addNotification('Quiz Started! 1 minute per question', '#4CAF50');
  };

  const handleAnswerSelect = (option) => {
    if (showExplanation) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      addNotification('Please select an answer!', '#FF9800');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.ans) {
      setScore(score + 1);
      addNotification('✓ Correct!', '#4CAF50');
    } else {
      addNotification('✗ Incorrect', '#f44336');
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeRemaining(60);
    } else {
      setQuizComplete(true);
    }
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setSelectedAnswer(null);
  };

  const formatTime = (seconds) => {
    return `${seconds.toString().padStart(2, '0')}s`;
  };

  // MENU SCREEN
  if (currentScreen === 'menu') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '50px 20px',
            marginBottom: '30px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '52px', color: '#333', margin: '0 0 15px' }}>
              📊 A-Level Economics MCQ
            </h1>
            <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>
              100 Unique Questions • 2015-2026 • 1 Minute Per Question (100 Minutes Total)
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '40px 30px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <button
              onClick={startQuiz}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '20px 60px',
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              START QUIZ 🚀
            </button>

            <div style={{ fontSize: '80px', margin: '30px 0' }}>💼</div>
            <p style={{ color: '#666', fontSize: '16px', margin: '20px 0' }}>
              Test your A-Level Economics knowledge with 100 exam-style questions covering all topics from microeconomics to development economics.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 15px', color: '#333', fontSize: '18px' }}>📚 Topics Covered</h3>
              <ul style={{ margin: 0, padding: '0 20px', color: '#666', fontSize: '14px' }}>
                <li style={{ marginBottom: '8px' }}>Supply & Demand</li>
                <li style={{ marginBottom: '8px' }}>Elasticity</li>
                <li style={{ marginBottom: '8px' }}>Market Structures</li>
                <li style={{ marginBottom: '8px' }}>Macroeconomics</li>
                <li style={{ marginBottom: '8px' }}>Monetary/Fiscal Policy</li>
                <li>International Trade</li>
              </ul>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 15px', color: '#333', fontSize: '18px' }}>⏱️ Features</h3>
              <ul style={{ margin: 0, padding: '0 20px', color: '#666', fontSize: '14px' }}>
                <li style={{ marginBottom: '8px' }}>100 unique questions</li>
                <li style={{ marginBottom: '8px' }}>1 minute per question</li>
                <li style={{ marginBottom: '8px' }}>Randomized each time</li>
                <li style={{ marginBottom: '8px' }}>Year shown (2015-2026)</li>
                <li style={{ marginBottom: '8px' }}>Instant feedback</li>
                <li>Bilingual explanations</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
          {notifications.map(notif => (
            <div key={notif.id} style={{
              background: notif.color,
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              marginBottom: '10px',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              {notif.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  if (currentScreen === 'quiz' && !quizComplete) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
    const timeWarning = timeRemaining < 15;

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div>
                <p style={{ margin: '0 0 5px', color: '#666', fontSize: '12px' }}>Progress</p>
                <p style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                  {currentQuestionIndex + 1}/100
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px', color: '#666', fontSize: '12px' }}>Score</p>
                <p style={{ margin: 0, color: '#4CAF50', fontSize: '16px', fontWeight: 'bold' }}>
                  {score} correct
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 5px', color: '#666', fontSize: '12px' }}>Time Per Question</p>
                <p style={{ margin: 0, color: timeWarning ? '#f44336' : '#333', fontSize: '16px', fontWeight: 'bold' }}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>

            <div style={{
              background: '#eee',
              borderRadius: '8px',
              height: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#667eea',
                height: '100%',
                width: `${progress}%`,
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, color: '#333', flex: 1, fontSize: '18px' }}>
                {currentQuestion.q}
              </h3>
              <span style={{
                background: '#f0f0f0',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                color: '#666',
                whiteSpace: 'nowrap',
                marginLeft: '15px'
              }}>
                {currentQuestion.year}
              </span>
            </div>

            <div style={{ marginTop: '20px' }}>
              {currentQuestion.opts.map((option, index) => {
                const optionLetter = option[0];
                const isSelected = selectedAnswer === optionLetter;
                const isCorrect = optionLetter === currentQuestion.ans;
                const showCorrect = showExplanation && isCorrect;
                const showIncorrect = showExplanation && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(optionLetter)}
                    disabled={showExplanation}
                    style={{
                      width: '100%',
                      padding: '15px',
                      marginBottom: '10px',
                      border: `2px solid ${
                        showCorrect ? '#4CAF50' :
                        showIncorrect ? '#f44336' :
                        isSelected ? '#667eea' :
                        '#ddd'
                      }`,
                      background: `${
                        showCorrect ? '#e8f5e9' :
                        showIncorrect ? '#ffebee' :
                        isSelected ? '#f0f4ff' :
                        'white'
                      }`,
                      borderRadius: '8px',
                      cursor: showExplanation ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      textAlign: 'left',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      transition: 'all 0.2s'
                    }}
                  >
                    {option}
                    {showCorrect && ' ✓'}
                    {showIncorrect && ' ✗'}
                  </button>
                );
              })}
            </div>
          </div>

          {showExplanation && (
            <div style={{
              background: '#fff9c4',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px',
              borderLeft: '4px solid #FBC02D'
            }}>
              <h4 style={{ margin: '0 0 12px', color: '#333' }}>Explanation:</h4>
              
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 8px', color: '#333', fontWeight: 'bold', fontSize: '14px' }}>
                  English 🇬🇧
                </p>
                <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                  {currentQuestion.exp}
                </p>
              </div>

              <div>
                <p style={{ margin: '0 0 8px', color: '#333', fontWeight: 'bold', fontSize: '14px' }}>
                  中文 🇨🇳
                </p>
                <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                  {currentQuestion.expCh}
                </p>
              </div>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                style={{
                  gridColumn: '1 / -1',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '15px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Submit Answer
              </button>
            ) : (
              <>
                <button
                  onClick={handleBackToMenu}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '15px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleNextQuestion}
                  style={{
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '15px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'See Results →' : 'Next →'}
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
          {notifications.map(notif => (
            <div key={notif.id} style={{
              background: notif.color,
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              marginBottom: '10px',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              {notif.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (currentScreen === 'quiz' && quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let resultMessage = '';
    let resultColor = '';

    if (percentage === 100) {
      resultMessage = 'PERFECT SCORE! Outstanding Economics Knowledge! 🌟🌟🌟';
      resultColor = '#4CAF50';
    } else if (percentage >= 85) {
      resultMessage = 'Excellent! A-Level Ready! 🎓';
      resultColor = '#8BC34A';
    } else if (percentage >= 70) {
      resultMessage = 'Good Performance! Keep Studying! 📚';
      resultColor = '#2196F3';
    } else if (percentage >= 50) {
      resultMessage = 'Fair Score! More Review Needed 💪';
      resultColor = '#FF9800';
    } else {
      resultMessage = 'Keep Practicing! You\'ll Improve! 📖';
      resultColor = '#f44336';
    }

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '50px 30px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          maxWidth: '700px'
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px', color: '#333' }}>
            Quiz Complete! ✨
          </h1>

          <div style={{
            background: resultColor,
            color: 'white',
            borderRadius: '12px',
            padding: '50px 20px',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '80px', fontWeight: 'bold', marginBottom: '15px' }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px' }}>
              {score} out of 100
            </div>
            <div style={{ fontSize: '18px' }}>
              {resultMessage}
            </div>
          </div>

          <div style={{
            background: '#f5f5f5',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <p style={{ margin: '0 0 10px', color: '#333', fontWeight: 'bold' }}>Summary:</p>
            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
              • Total Questions: 100
            </p>
            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
              • Correct Answers: {score}
            </p>
            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
              • Wrong Answers: {100 - score}
            </p>
            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
              • Accuracy Rate: {percentage}%
            </p>
            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
              • Total Time: ~100 minutes (1 min/question)
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            <button
              onClick={handleBackToMenu}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '15px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Back to Menu
            </button>

            <button
              onClick={startQuiz}
              style={{
                background: '#764ba2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '15px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Try Again (New Set)
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default EconomicsQuiz;
