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
import {
  CoupleState,
  Expense,
  SavingGoal,
  BudgetLimit,
  ExpenseCategory,
} from '../types';
import { COLORS } from '../constants/theme';
import { geminiService } from '../services/gemini';
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
} from 'lucide-react-native';

interface TreasuryScreenProps {
  couple: CoupleState;
  expenses: Expense[];
  savings: SavingGoal[];
  budgetLimit: BudgetLimit;
  onAddExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onAddSavingGoal: (goal: SavingGoal) => void;
  onContributeSavings: (goalId: string, amount: number) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Food & Cafés',
  'Activities & Dates',
  'Living Space',
  'Travel & Adventure',
  'Nostalgic Gifts',
  'Other',
];

export const TreasuryScreen: React.FC<TreasuryScreenProps> = ({
  couple,
  expenses,
  savings,
  budgetLimit,
  onAddExpense,
  onDeleteExpense,
  onAddSavingGoal,
  onContributeSavings,
}) => {
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // New Expense form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Cafés');
  const [paidBy, setPaidBy] = useState(couple.activeUser);

  // New Goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  // 50/50 Settlement Algorithm from blueprint
  const calculateSettlement = (
    expenseList: Expense[],
    p1: string,
    p2: string
  ): { text: string; isEven: boolean; debtor?: string; creditor?: string; amount?: string } => {
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
        debtor: p2,
        creditor: p1,
        amount: diff,
      };
    } else if (p2Paid > p1Paid) {
      const diff = ((p2Paid - p1Paid) / 2).toFixed(2);
      return {
        text: `${p1} owes ${p2} $${diff}`,
        isEven: false,
        debtor: p1,
        creditor: p2,
        amount: diff,
      };
    } else {
      return { text: 'All settled up! 🤝', isEven: true };
    }
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetRatio = Math.min(1, totalSpent / budgetLimit.monthlyLimit);
  const settlement = calculateSettlement(
    expenses,
    couple.partner1Name,
    couple.partner2Name
  );

  const handleCreateExpense = () => {
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newExp: Expense = {
      id: `exp_${Date.now()}`,
      coupleId: couple.coupleId,
      title: title.trim(),
      amount: parsedAmount,
      category,
      paidBy,
      timestamp: Date.now(),
    };

    onAddExpense(newExp);
    setExpenseModalOpen(false);
    setTitle('');
    setAmount('');
  };

  const handleCreateGoal = () => {
    const parsedTarget = parseFloat(goalTarget);
    if (!goalTitle.trim() || isNaN(parsedTarget) || parsedTarget <= 0) return;

    const newGoal: SavingGoal = {
      id: `goal_${Date.now()}`,
      coupleId: couple.coupleId,
      title: goalTitle.trim(),
      targetAmount: parsedTarget,
      currentSaved: 0,
      timestamp: Date.now(),
    };

    onAddSavingGoal(newGoal);
    setGoalModalOpen(false);
    setGoalTitle('');
    setGoalTarget('');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Monthly Budget Tracker Card */}
      <View style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Wallet size={18} color={COLORS.RoseCoral} />
            <Text style={styles.budgetLabel}>Monthly Shared Budget</Text>
          </View>
          <Text style={styles.budgetPercent}>
            {Math.round(budgetRatio * 100)}% Used
          </Text>
        </View>

        <View style={styles.budgetNumbers}>
          <Text style={styles.totalSpentText}>${totalSpent.toFixed(2)}</Text>
          <Text style={styles.limitText}>
            / ${budgetLimit.monthlyLimit.toFixed(2)} limit
          </Text>
        </View>

        {/* Progress Bar */}
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
        <Text style={styles.budgetRemaining}>
          ${Math.max(0, budgetLimit.monthlyLimit - totalSpent).toFixed(2)} safe to spend
        </Text>
      </View>

      {/* 50/50 Debt Settlement Card */}
      <View style={styles.settlementCard}>
        <View style={styles.settlementTop}>
          <Scale size={18} color="#059669" />
          <Text style={styles.settlementHeading}>50/50 Fair Split Settlement</Text>
        </View>
        <Text
          style={[
            styles.settlementResult,
            settlement.isEven ? { color: '#059669' } : { color: COLORS.WarmCharcoal },
          ]}
        >
          {settlement.text}
        </Text>
        <Text style={styles.settlementSub}>
          Calculated automatically across all personal payments so nobody has to ask.
        </Text>
      </View>

      {/* AI Financial Co-pilot Card */}
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Sparkles size={18} color={COLORS.HoneyYellow} />
            <Text style={styles.aiTitle}>AI Financial Co-pilot</Text>
          </View>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={requestAiCoPilot}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.aiButtonText}>Ask Advice</Text>
            )}
          </TouchableOpacity>
        </View>

        {aiAdvice ? (
          <View style={styles.adviceBox}>
            <Text style={styles.adviceText}>{aiAdvice}</Text>
          </View>
        ) : (
          <Text style={styles.aiPlaceholder}>
            Tap "Ask Advice" to get encouraging budget tips and creative, free date ideas tailored to your recent habits!
          </Text>
        )}
      </View>

      {/* Collaborative Savings Goals Section */}
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Target size={18} color={COLORS.WarmCharcoal} />
          <Text style={styles.sectionTitle}>Collaborative Savings Goals</Text>
        </View>
        <TouchableOpacity
          style={styles.addMiniButton}
          onPress={() => setGoalModalOpen(true)}
        >
          <Plus size={14} color={COLORS.RoseCoral} />
          <Text style={styles.addMiniText}>New Goal</Text>
        </TouchableOpacity>
      </View>

      {savings.map((g) => {
        const goalRatio = Math.min(1, g.currentSaved / g.targetAmount);
        return (
          <View key={g.id} style={styles.goalCard}>
            <View style={styles.goalTopRow}>
              <Text style={styles.goalTitle}>{g.title}</Text>
              <Text style={styles.goalAmount}>
                ${g.currentSaved.toFixed(0)} / ${g.targetAmount.toFixed(0)}
              </Text>
            </View>
            <View style={styles.goalTrack}>
              <View
                style={[styles.goalFill, { width: `${goalRatio * 100}%` }]}
              />
            </View>
            <View style={styles.goalBottomRow}>
              <Text style={styles.goalPercent}>
                {Math.round(goalRatio * 100)}% achieved
              </Text>
              <TouchableOpacity
                style={styles.contributeButton}
                onPress={() => onContributeSavings(g.id, 25)}
              >
                <TrendingUp size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.contributeText}>+ $25 Deposit</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Shared Spending Ledger Section */}
      <View style={[styles.sectionHeader, { marginTop: 14 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DollarSign size={18} color={COLORS.WarmCharcoal} />
          <Text style={styles.sectionTitle}>Shared Spending Ledger</Text>
        </View>
        <TouchableOpacity
          style={styles.addExpenseButton}
          onPress={() => setExpenseModalOpen(true)}
        >
          <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.addExpenseText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {expenses.length === 0 ? (
        <View style={styles.emptyLedger}>
          <Text style={styles.emptyLedgerText}>No expenses logged yet.</Text>
        </View>
      ) : (
        expenses.map((e) => (
          <View key={e.id} style={styles.expenseItem}>
            <View style={{ flex: 1 }}>
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
              onPress={() => onDeleteExpense(e.id)}
            >
              <Trash2 size={16} color="#AAA" />
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Add Expense Modal */}
      <Modal
        visible={expenseModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setExpenseModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Log Shared Expense</Text>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Romantic Lavender Café Date"
              placeholderTextColor="#AAA"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 34.50"
              placeholderTextColor="#AAA"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.inputLabel}>Paid By</Text>
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
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.selectedCategoryChip,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat && styles.selectedCategoryChipText,
                    ]}
                  >
                    {cat}
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

      {/* Add Goal Modal */}
      <Modal
        visible={goalModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setGoalModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Create Savings Goal</Text>

            <Text style={styles.inputLabel}>Goal Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Our Tokyo Dream Trip ✈️"
              placeholderTextColor="#AAA"
              value={goalTitle}
              onChangeText={setGoalTitle}
            />

            <Text style={styles.inputLabel}>Target Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 3500.00"
              placeholderTextColor="#AAA"
              keyboardType="decimal-pad"
              value={goalTarget}
              onChangeText={setGoalTarget}
            />

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleCreateGoal}
            >
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalSubmitText}>Start Saving Together</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
  },
  content: {
    padding: 16,
    paddingBottom: 90,
  },
  budgetCard: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    marginBottom: 14,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  budgetPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
  budgetNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  totalSpentText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  limitText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
    marginLeft: 6,
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#EBE2D8',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  budgetRemaining: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
    textAlign: 'right',
  },
  settlementCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 14,
  },
  settlementTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  settlementHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  settlementResult: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  settlementSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 4,
  },
  aiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
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
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  aiButton: {
    backgroundColor: COLORS.HoneyYellow,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5C3E00',
  },
  adviceBox: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.HoneyYellow,
  },
  adviceText: {
    fontSize: 13,
    color: COLORS.WarmCharcoal,
    lineHeight: 19,
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
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  addMiniButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SoftRose,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  addMiniText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.RoseCoral,
    marginLeft: 3,
  },
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.RoseCoral,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  addExpenseText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    marginBottom: 10,
  },
  goalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  goalAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.RoseCoral,
  },
  goalTrack: {
    height: 8,
    backgroundColor: '#EBE2D8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  goalFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  goalBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalPercent: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
  },
  contributeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  contributeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyLedger: {
    padding: 20,
    alignItems: 'center',
  },
  emptyLedgerText: {
    fontSize: 13,
    color: COLORS.WarmCharcoalMuted,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    marginBottom: 8,
  },
  expenseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  expenseCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
  },
  expenseDot: {
    fontSize: 11,
    color: '#AAA',
    marginHorizontal: 5,
  },
  expensePaidBy: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.RoseCoral,
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginRight: 10,
  },
  deleteButton: {
    padding: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
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
  },
  payerOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 3,
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
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 6,
  },
  selectedCategoryChip: {
    backgroundColor: COLORS.WarmCharcoal,
    borderColor: COLORS.WarmCharcoal,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.WarmCharcoal,
  },
  selectedCategoryChipText: {
    color: '#FFFFFF',
  },
  modalSubmitButton: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
  },
});
