## Text matching 
```
recieved entities: ki
score of each entities of a candidate text: ksi = θi* wi * si
	si: salience of ki
	θi: importance factor
	(?)wi: an assigned weight according to the intent (?)
The final score of the candidate text is sum of all ksi	
(?) should we only consider texts in datasets relevated to the intent?
	for example: for a query with intent of outline, only consider texts from course outline pages as candidate texts 
```

## Learning
```
Ask user to choose a best anwser
	(?)only 1 or severals?
increase θ of the keywords in the text 
	(?)by its salience?
	θi = θ(1+si)
```
