import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useWeSpace } from '../../context/WeSpaceContext';
import { Expense, SavingGoal, ExpenseCategory } from '../../types';
import { COLORS } from '../../constants/theme';
import { geminiService } from '../../services/gemini';
import {
  Wallet,
  Plus,
  Scale,
  Sparkles,
  Target,
  Trash2,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Edit2,
  Handshake,
  PieChart,
} from 'lucide-react-native';

const CATEGORIES: { name: ExpenseCategory; color: string; emoji: string }[] = [
  { name: 'Food & Cafés', color: '#EE5D6C', emoji: '☕' },
  { name: 'Activities & Dates', color: '#9D74E7', emoji: '🎟️' },
  { name: 'Living Space', color: '#F4B942', emoji: '🕯️' },
  { name: 'Travel & Adventure', color: '#2A9D8F', emoji: '✈️' },
  { name: 'Nostalgic Gifts', color: '#5EB1EF', emoji: '🎁' },
  { name: 'Other', color: '#9C8E85', emoji: '✨' },
];

export default function TreasuryScreen() {
  const {
    couple,
    expenses,
    savings,
    budgetLimit,
    addExpense,
    deleteExpense,
    settleAllExpenses,
    updateBudgetLimit,
    addSavingGoal,
    contributeSavings,
  } = useWeSpace();

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [filterPayer, setFilterPayer] = useState<string>('ALL');

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // New Expense Form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Cafés');
  const [paidBy, setPaidBy] = useState(couple.activeUser);

  // New Goal Form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalEmoji, setGoalEmoji] = useState('✈️');

  // Limit Form
  const [limitInput, setLimitInput] = useState(
    budgetLimit.monthlyLimit.toString()
  );

  // 50/50 Settlement Algorithm from Blueprint
  const calculateSettlement = (
    expenseList: Expense[],
    p1: string,
    p2: string
  ) => {
    const p1Paid = expenseList
      .filter((e) => e.paidBy === p1)
      .reduce((acc, e) => acc + e.amount, 0);
    const p2Paid = expenseList
      .filter((e) => e.paidBy === p2)
      .reduce((acc, e) => acc + e.amount, 0);

    if (p1Paid > p2Paid) {
      const diff = ((p1Paid - p2Paid) / 2).toFixed(2);
      return {
        text: `${p2} owes ${p1} $${diff}`,
        isEven: false,
        p1Paid,
        p2Paid,
      };
    } else if (p2Paid > p1Paid) {
      const diff = ((p2Paid - p1Paid) / 2).toFixed(2);
      return {
        text: `${p1} owes ${p2} $${diff}`,
        isEven: false,
        p1Paid,
        p2Paid,
      };
    } else {
      return { text: 'All settled up! 🤝', isEven: true, p1Paid, p2Paid };
    }
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetRatio = Math.min(1, totalSpent / budgetLimit.monthlyLimit);
  const settlement = calculateSettlement(
    expenses,
    couple.partner1Name,
    couple.partner2Name
  );

  const filteredExpenses =
    filterPayer === 'ALL'
      ? expenses
      : expenses.filter((e) => e.paidBy === filterPayer);

  const handleCreateExpense = () => {
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    addExpense({
      id: `exp_${Date.now()}`,
      coupleId: couple.coupleId,
      title: title.trim(),
      amount: parsedAmount,
      category,
      paidBy,
      timestamp: Date.now(),
    });
    setExpenseModalOpen(false);
    setTitle('');
    setAmount('');
  };

  const handleCreateGoal = () => {
    const parsedTarget = parseFloat(goalTarget);
    if (!goalTitle.trim() || isNaN(parsedTarget) || parsedTarget <= 0) return;

    addSavingGoal({
      id: `goal_${Date.now()}`,
      coupleId: couple.coupleId,
      title: goalTitle.trim(),
      emoji: goalEmoji || '✨',
      targetAmount: parsedTarget,
      currentSaved: 0,
      timestamp: Date.now(),
    });
    setGoalModalOpen(false);
    setGoalTitle('');
    setGoalTarget('');
  };

  const handleSaveLimit = () => {
    const parsed = parseFloat(limitInput);
    if (!isNaN(parsed) && parsed > 0) {
      updateBudgetLimit(parsed);
    }
    setLimitModalOpen(false);
  };

  const requestAiCoPilot = async () => {
    setAiLoading(true);
    const advice = await geminiService.generateFinancialAdvice(
      budgetLimit.monthlyLimit,
      totalSpent,
      expenses,
      savings,
      couple.geminiApiKey
    );
    setAiAdvice(advice);
    setAiLoading(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. MONTHLY SHARED BUDGET CARD */}
      <View style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.walletIconBox}>
              <Wallet size={16} color={COLORS.RoseCoral} />
            </View>
            <Text style={styles.budgetLabel}>Nest Treasury Budget</Text>
          </View>
          <TouchableOpacity
            style={styles.editLimitBtn}
            onPress={() => {
              setLimitInput(budgetLimit.monthlyLimit.toString());
              setLimitModalOpen(true);
            }}
          >
            <Edit2 size={11} color={COLORS.WarmCharcoalMuted} />
            <Text style={styles.editLimitText}>Edit Limit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.budgetNumbersRow}>
          <Text style={styles.totalSpentText}>${totalSpent.toFixed(2)}</Text>
          <Text style={styles.limitText}>
            of ${budgetLimit.monthlyLimit.toFixed(0)} monthly limit
          </Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${budgetRatio * 100}%`,
                backgroundColor:
                  budgetRatio > 0.9 ? COLORS.Danger : COLORS.RoseCoral,
              },
            ]}
          />
        </View>

        <View style={styles.budgetMetaRow}>
          <Text style={styles.budgetMetaItem}>
            {couple.partner1Name}: ${settlement.p1Paid.toFixed(2)}
          </Text>
          <Text style={styles.budgetMetaItem}>
            {couple.partner2Name}: ${settlement.p2Paid.toFixed(2)}
          </Text>
          <Text style={styles.budgetSafeText}>
            ${Math.max(0, budgetLimit.monthlyLimit - totalSpent).toFixed(2)} left
          </Text>
        </View>
      </View>

      {/* 2. 50/50 DEBT SETTLEMENT CALCULATOR */}
      <View style={styles.settlementCard}>
        <View style={styles.settlementTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Scale size={17} color="#047857" />
            <Text style={styles.settlementHeading}>
              50/50 Fair Split Calculator
            </Text>
          </View>
          {!settlement.isEven && (
            <TouchableOpacity
              style={styles.settleUpBtn}
              onPress={settleAllExpenses}
            >
              <Handshake size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.settleUpBtnText}>Mark Settled</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.settlementResult}>{settlement.text}</Text>
        <Text style={styles.settlementSub}>
          Automatically balances out individual payments so finances stay stress-free.
        </Text>
      </View>

      {/* 3. CATEGORY SPENDING BREAKDOWN */}
      {totalSpent > 0 && (
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <PieChart size={15} color={COLORS.WarmCharcoal} />
            <Text style={styles.breakdownTitle}>Category Breakdown</Text>
          </View>

          {/* Stacked Bar */}
          <View style={styles.stackedBar}>
            {CATEGORIES.map((cat) => {
              const catSum = expenses
                .filter((e) => e.category === cat.name)
                .reduce((acc, e) => acc + e.amount, 0);
              if (catSum <= 0) return null;
              const pct = (catSum / totalSpent) * 100;
              return (
                <View
                  key={cat.name}
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor: cat.color,
                  }}
                />
              );
            })}
          </View>

          <View style={styles.legendWrap}>
            {CATEGORIES.map((cat) => {
              const catSum = expenses
                .filter((e) => e.category === cat.name)
                .reduce((acc, e) => acc + e.amount, 0);
              if (catSum <= 0) return null;
              return (
                <View key={cat.name} style={styles.legendChip}>
                  <View
                    style={[styles.legendDot, { backgroundColor: cat.color }]}
                  />
                  <Text style={styles.legendLabel}>
                    {cat.emoji} {cat.name}: ${catSum.toFixed(0)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* 4. AI FINANCIAL CO-PILOT */}
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Sparkles size={17} color="#D97706" />
            <Text style={styles.aiTitle}>WeSpace Financial Co-pilot</Text>
          </View>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={requestAiCoPilot}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <ActivityIndicator size="small" color="#5C3E00" />
            ) : (
              <Text style={styles.aiButtonText}>Generate Insight ✨</Text>
            )}
          </TouchableOpacity>
        </View>

        {aiAdvice ? (
          <View style={styles.adviceBox}>
            <Text style={styles.adviceText}>{aiAdvice}</Text>
          </View>
        ) : (
          <Text style={styles.aiPlaceholder}>
            Tap "Generate Insight" for warm budget encouragement and creative, zero-cost romantic date ideas tailored to your goals.
          </Text>
        )}
      </View>

      {/* 5. COLLABORATIVE SAVINGS GOALS */}
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Target size={18} color={COLORS.WarmCharcoal} />
          <Text style={styles.sectionTitle}>Shared Dream Goals</Text>
        </View>
        <TouchableOpacity
          style={styles.addMiniButton}
          onPress={() => setGoalModalOpen(true)}
        >
          <Plus size={13} color={COLORS.RoseCoral} />
          <Text style={styles.addMiniText}>New Dream</Text>
        </TouchableOpacity>
      </View>

      {savings.map((g) => {
        const goalRatio = Math.min(1, g.currentSaved / g.targetAmount);
        return (
          <View key={g.id} style={styles.goalCard}>
            <View style={styles.goalTopRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.goalEmoji}>{g.emoji || '✨'}</Text>
                <View>
                  <Text style={styles.goalTitle}>{g.title}</Text>
                  <Text style={styles.goalPercent}>
                    {Math.round(goalRatio * 100)}% funded
                  </Text>
                </View>
              </View>
              <Text style={styles.goalAmount}>
                ${g.currentSaved.toFixed(0)}{' '}
                <Text style={{ color: COLORS.WarmCharcoalLight, fontSize: 12 }}>
                  / ${g.targetAmount.toFixed(0)}
                </Text>
              </Text>
            </View>

            <View style={styles.goalTrack}>
              <View
                style={[styles.goalFill, { width: `${goalRatio * 100}%` }]}
              />
            </View>

            <View style={styles.depositRow}>
              {[15, 50, 100].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={styles.depositChip}
                  onPress={() => contributeSavings(g.id, amt)}
                >
                  <TrendingUp size={11} color={COLORS.SageGreen} />
                  <Text style={styles.depositChipText}>+${amt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}

      {/* 6. SHARED SPENDING LEDGER */}
      <View style={[styles.sectionHeader, { marginTop: 14 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DollarSign size={18} color={COLORS.WarmCharcoal} />
          <Text style={styles.sectionTitle}>Shared Spending Ledger</Text>
        </View>
        <TouchableOpacity
          style={styles.addExpenseButton}
          onPress={() => {
            setPaidBy(couple.activeUser);
            setExpenseModalOpen(true);
          }}
        >
          <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.addExpenseText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Payer Pills */}
      <View style={styles.filterRow}>
        {['ALL', couple.partner1Name, couple.partner2Name, 'Shared'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterPill,
              filterPayer === f && styles.filterPillActive,
            ]}
            onPress={() => setFilterPayer(f)}
          >
            <Text
              style={[
                styles.filterPillText,
                filterPayer === f && styles.filterPillTextActive,
              ]}
            >
              {f === 'ALL' ? 'All Entries' : `Paid by ${f}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredExpenses.map((e) => {
        const catMeta =
          CATEGORIES.find((c) => c.name === e.category) || CATEGORIES[5];
        return (
          <View key={e.id} style={styles.expenseItem}>
            <View
              style={[
                styles.expenseEmojiCircle,
                { backgroundColor: `${catMeta.color}18` },
              ]}
            >
              <Text style={{ fontSize: 16 }}>{catMeta.emoji}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.expenseTitle}>{e.title}</Text>
              <View style={styles.expenseMeta}>
                <Text style={styles.expenseCategory}>{e.category}</Text>
                <Text style={styles.expenseDot}>•</Text>
                <Text style={styles.expensePaidBy}>Paid by {e.paidBy}</Text>
              </View>
            </View>
            <Text style={styles.expenseAmount}>${e.amount.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteExpense(e.id)}
            >
              <Trash2 size={15} color="#B8AFA8" />
            </TouchableOpacity>
          </View>
        );
      })}

      {/* MODAL 1: ADD EXPENSE */}
      <Modal
        visible={expenseModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setExpenseModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Log Shared Expense</Text>

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Romantic Lavender Café Date"
              placeholderTextColor="#A89F98"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 34.50"
              placeholderTextColor="#A89F98"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.inputLabel}>Who Paid?</Text>
            <View style={styles.payerRow}>
              {[couple.partner1Name, couple.partner2Name, 'Shared'].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.payerOption,
                    paidBy === p && styles.selectedPayer,
                  ]}
                  onPress={() => setPaidBy(p)}
                >
                  <Text
                    style={[
                      styles.payerText,
                      paidBy === p && styles.selectedPayerText,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 18 }}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  style={[
                    styles.categoryChip,
                    category === cat.name && styles.selectedCategoryChip,
                  ]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat.name && styles.selectedCategoryChipText,
                    ]}
                  >
                    {cat.emoji} {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleCreateExpense}
            >
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalSubmitText}>Save Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setExpenseModalOpen(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: ADD SAVINGS GOAL */}
      <Modal
        visible={goalModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setGoalModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>New Collaborative Dream</Text>

            <Text style={styles.inputLabel}>Icon Emoji</Text>
            <View style={styles.payerRow}>
              {['✈️', '🏡', '📽️', '🍣', '💍', '🚗'].map((em) => (
                <TouchableOpacity
                  key={em}
                  style={[
                    styles.payerOption,
                    goalEmoji === em && styles.selectedPayer,
                  ]}
                  onPress={() => setGoalEmoji(em)}
                >
                  <Text style={{ fontSize: 18 }}>{em}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Dream Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Autumn Kyoto Trip"
              placeholderTextColor="#A89F98"
              value={goalTitle}
              onChangeText={setGoalTitle}
            />

            <Text style={styles.inputLabel}>Target Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 3500"
              placeholderTextColor="#A89F98"
              keyboardType="decimal-pad"
              value={goalTarget}
              onChangeText={setGoalTarget}
            />

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleCreateGoal}
            >
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalSubmitText}>Create Savings Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setGoalModalOpen(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: EDIT MONTHLY BUDGET LIMIT */}
      <Modal
        visible={limitModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLimitModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Monthly Budget Limit ($)</Text>
            <TextInput
              style={styles.input}
              value={limitInput}
              onChangeText={setLimitInput}
              keyboardType="decimal-pad"
              placeholder="1200"
            />
            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleSaveLimit}
            >
              <Text style={styles.modalSubmitText}>Update Limit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  budgetCard: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    marginBottom: 14,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  walletIconBox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.SoftRose,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  budgetLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  editLimitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3ECE4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  editLimitText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
  budgetNumbersRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  totalSpentText: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  limitText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
    marginLeft: 6,
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#EBE2D8',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  budgetMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetMetaItem: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
  budgetSafeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.SageGreen,
  },
  settlementCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 14,
  },
  settlementTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  settlementHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settleUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  settleUpBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  settlementResult: {
    fontSize: 21,
    fontWeight: '900',
    color: '#064E3B',
  },
  settlementSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 4,
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
    marginBottom: 14,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  stackedBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 10,
  },
  legendWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
  },
  aiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 18,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  aiButton: {
    backgroundColor: COLORS.HoneyYellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  aiButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5C3E00',
  },
  adviceBox: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.HoneyYellow,
  },
  adviceText: {
    fontSize: 13,
    color: COLORS.WarmCharcoal,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  aiPlaceholder: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  addMiniButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SoftRose,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  addMiniText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.RoseCoral,
    marginLeft: 4,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
    marginBottom: 10,
  },
  goalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  goalPercent: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
  },
  goalAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.SageGreen,
  },
  goalTrack: {
    height: 8,
    backgroundColor: '#EBE2D8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  goalFill: {
    height: '100%',
    backgroundColor: COLORS.SageGreen,
    borderRadius: 4,
  },
  depositRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  depositChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SageGreenSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  depositChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.SageGreen,
  },
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.RoseCoral,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addExpenseText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  filterPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  filterPillActive: {
    backgroundColor: COLORS.WarmCharcoal,
    borderColor: COLORS.WarmCharcoal,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
    marginBottom: 8,
  },
  expenseEmojiCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  expenseCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
  },
  expenseDot: {
    fontSize: 11,
    color: '#CCC',
    marginHorizontal: 5,
  },
  expensePaidBy: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.RoseCoral,
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginRight: 10,
  },
  deleteButton: {
    padding: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(42, 36, 33, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.CozyCream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderTopWidth: 1,
    borderColor: COLORS.ShadowBeige,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.WarmCharcoal,
    marginBottom: 12,
  },
  payerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 6,
  },
  payerOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  selectedPayer: {
    borderColor: COLORS.RoseCoral,
    backgroundColor: COLORS.SoftRose,
  },
  payerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
  },
  selectedPayerText: {
    color: COLORS.RoseCoral,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 6,
  },
  selectedCategoryChip: {
    backgroundColor: COLORS.WarmCharcoal,
    borderColor: COLORS.WarmCharcoal,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
  },
  selectedCategoryChipText: {
    color: '#FFFFFF',
  },
  modalSubmitButton: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
});
